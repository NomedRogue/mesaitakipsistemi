import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Update the path to point to the data directory in the project root
const DATA_DIR = path.join(process.cwd(), "data")
const IZINLER_FILE = path.join(DATA_DIR, "izinler.json")

function ensureFileExists() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(IZINLER_FILE)) {
      fs.writeFileSync(IZINLER_FILE, "[]", "utf8")
    }
  } catch (error) {
    console.error("Dosya sistemi hatası:", error)
    throw error
  }
}

function readIzinler() {
  try {
    ensureFileExists()
    const fileContent = fs.readFileSync(IZINLER_FILE, "utf8")
    return JSON.parse(fileContent)
  } catch (error) {
    console.error("İzinler okuma hatası:", error)
    throw error
  }
}

function writeIzinler(data: any) {
  try {
    ensureFileExists()
    fs.writeFileSync(IZINLER_FILE, JSON.stringify(data, null, 2), "utf8")
  } catch (error) {
    console.error("İzinler yazma hatası:", error)
    throw error
  }
}

export async function GET() {
  try {
    const izinler = readIzinler()
    return NextResponse.json(izinler)
  } catch (error) {
    console.error("GET isteği hatası:", error)
    return NextResponse.json({ error: "İzinler okunamadı" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const newIzin = await req.json()
    const izinler = readIzinler()
    const izinWithId = { ...newIzin, id: Date.now() }
    izinler.push(izinWithId)
    writeIzinler(izinler)
    return NextResponse.json(izinler)
  } catch (error) {
    console.error("POST isteği hatası:", error)
    return NextResponse.json({ error: "İzin eklenemedi" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const updatedIzin = await req.json()
    const izinler = readIzinler()
    const updatedList = izinler.map((izin: any) => (izin.id === updatedIzin.id ? updatedIzin : izin))
    writeIzinler(updatedList)
    return NextResponse.json(updatedList)
  } catch (error) {
    console.error("PUT isteği hatası:", error)
    return NextResponse.json({ error: "İzin güncellenemedi" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const id = Number(url.searchParams.get("id"))
    if (!id) {
      return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 })
    }

    const izinler = readIzinler()
    const filteredIzinler = izinler.filter((izin: any) => izin.id !== id)
    writeIzinler(filteredIzinler)
    return NextResponse.json(filteredIzinler)
  } catch (error) {
    console.error("DELETE isteği hatası:", error)
    return NextResponse.json({ error: "İzin silinemedi" }, { status: 500 })
  }
}

