import Papa from 'papaparse'
import type { DATEVMetadata, DATEVBooking, UploadedFile, FileType } from '../types'

function classifyFileType(description: string): FileType {
  const lower = description.toLowerCase()
  if (lower.includes('umbuchung')) return 'umbuchungen'
  if (lower.includes('lohnbuchung') || lower.includes('lohn')) return 'lohn'
  if (lower.includes('ra-micro') || lower.includes('ra micro')) return 'ra-micro'
  if (lower.includes('fibu') || lower.includes('buchungsstapel')) return 'fibu'
  return 'unknown'
}

function parseMetadata(metadataRow: string): DATEVMetadata {
  // Split the raw metadata row by semicolons
  // Fields are sometimes quoted
  const fields = metadataRow.split(';').map(f => f.replace(/^"|"$/g, '').trim())

  const description = fields[16] || ''
  const fileType = classifyFileType(description)

  // Extract month/year from description like "FiBu 01.2026" or "Lohnbuchungen 01/2026"
  let month = 1
  let year = 2026
  const dateMatch = description.match(/(\d{2})[./](\d{4})/)
  if (dateMatch) {
    month = parseInt(dateMatch[1], 10)
    year = parseInt(dateMatch[2], 10)
  }

  return {
    fileType,
    month,
    year,
    description,
    consultant: fields[8] || '',
    client: fields[7] || '',
  }
}

function parseAmount(raw: string): number {
  if (!raw) return 0
  // Remove quotes, replace German comma with dot
  const cleaned = raw.replace(/"/g, '').replace(',', '.').trim()
  return parseFloat(cleaned) || 0
}

function parseAccount(raw: string): number {
  if (!raw) return 0
  return parseInt(raw.replace(/"/g, '').trim(), 10) || 0
}

export function parseDATEVFile(file: File): Promise<UploadedFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const text = reader.result as string
        const lines = text.split(/\r?\n/)

        if (lines.length < 3) {
          reject(new Error('File has too few rows for DATEV format'))
          return
        }

        // Row 1: metadata
        const metadata = parseMetadata(lines[0])

        // Row 2: headers (skip)
        // Row 3+: data — parse with PapaParse
        const dataText = lines.slice(1).join('\n')

        const result = Papa.parse(dataText, {
          delimiter: ';',
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
        })

        const bookings: DATEVBooking[] = []
        const headers = result.meta.fields || []

        // Find column indices by header name
        const amountKey = headers.find(h => h.startsWith('Umsatz')) || headers[0]
        const shKey = headers.find(h => h.startsWith('Soll/Haben')) || headers[1]
        const kontoKey = headers.find(h => h === 'Konto') || headers[6]
        const gegenkontoKey = headers.find(h => h.startsWith('Gegenkonto')) || headers[7]
        const datumKey = headers.find(h => h === 'Belegdatum') || headers[9]
        const textKey = headers.find(h => h === 'Buchungstext') || headers[13]
        const kost1Key = headers.find(h => h.startsWith('KOST1')) || headers[36]

        for (const row of result.data as Record<string, string>[]) {
          const amountRaw = row[amountKey]
          if (!amountRaw) continue

          const amount = parseAmount(amountRaw)
          if (amount === 0) continue

          const sh = (row[shKey] || '').replace(/"/g, '').trim()
          const isDebit = sh === 'S'

          bookings.push({
            amount,
            isDebit,
            account: parseAccount(row[kontoKey]),
            counterAccount: parseAccount(row[gegenkontoKey]),
            date: (row[datumKey] || '').replace(/"/g, '').trim(),
            description: (row[textKey] || '').replace(/"/g, '').trim(),
            costCenter: (row[kost1Key] || '').replace(/"/g, '').trim(),
            month: metadata.month,
            year: metadata.year,
            fileType: metadata.fileType,
          })
        }

        resolve({
          name: file.name,
          metadata,
          bookings,
          rowCount: bookings.length,
        })
      } catch (e) {
        reject(new Error(`Failed to parse DATEV file: ${e instanceof Error ? e.message : String(e)}`))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    // Read as ISO-8859-1
    reader.readAsText(file, 'ISO-8859-1')
  })
}
