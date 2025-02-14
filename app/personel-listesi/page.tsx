"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PersonelForm } from "./personel-form"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, Upload, UserPlus, Download } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { getPersoneller, updatePersonel, addPersonel, deletePersonel } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

function generateCSVTemplate() {
  const headers = ["TC", "Ad", "Soyad", "Departman", "Unvan", "Klinik", "Mesai Tamamlama", "Mesai Dışı Çalışır"]
  const exampleData = ["12345678901", "Ahmet", "Yılmaz", "Diş Polikliniği", "Diş Tabibi", "101", "false", "true"]
  return `${headers.join(",")}\n${exampleData.join(",")}`
}

interface Personel {
  id: number
  tc: string
  ad: string
  soyad: string
  departman: string
  unvan: string
  klinik: string
  mesaiTamamlama: boolean
  mesaiDisiCalisir: boolean
}

export default function PersonelYonetimi() {
  const [personelList, setPersonelList] = useState<Personel[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [editingPersonel, setEditingPersonel] = useState<Personel | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Personel; direction: "ascending" | "descending" } | null>(
    null,
  )
  const [filteredPersonel, setFilteredPersonel] = useState<Personel[]>([]) // Yeni state eklendi
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchPersonel = async () => {
      try {
        const data = await getPersoneller()
        setPersonelList(data)
      } catch (error) {
        console.error("Personel verileri alınırken hata oluştu:", error)
        toast({
          title: "Hata",
          description: "Personel verileri alınırken bir hata oluştu.",
          variant: "destructive",
        })
      }
    }
    fetchPersonel()
  }, [])

  useEffect(() => {
    const lowercasedSearch = searchTerm.toLowerCase().trim()
    const filtered = personelList.filter((personel) => {
      return (
        personel.tc.toLowerCase().includes(lowercasedSearch) ||
        personel.ad.toLowerCase().includes(lowercasedSearch) ||
        personel.soyad.toLowerCase().includes(lowercasedSearch) ||
        personel.departman.toLowerCase().includes(lowercasedSearch) ||
        personel.unvan.toLowerCase().includes(lowercasedSearch) ||
        personel.klinik.toString().toLowerCase().includes(lowercasedSearch)
      )
    })
    setFilteredPersonel(filtered)
  }, [searchTerm, personelList])

  const handleDelete = async (id: number) => {
    try {
      const updatedList = await deletePersonel(id)
      setPersonelList(updatedList)
      toast({
        title: "Başarılı",
        description: "Personel başarıyla silindi.",
      })
    } catch (error) {
      console.error("Personel silinirken hata oluştu:", error)
      toast({
        title: "Hata",
        description: "Personel silinirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (id: number) => {
    const personelToEdit = personelList.find((p) => p.id === id)
    if (personelToEdit) {
      setEditingPersonel(personelToEdit)
      setIsModalOpen(true)
    }
  }

  const handleSort = (key: keyof Personel) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const handleSwitchChange = async (id: number, field: "mesaiTamamlama" | "mesaiDisiCalisir", checked: boolean) => {
    try {
      const personelToUpdate = personelList.find((p) => p.id === id)
      if (personelToUpdate) {
        const updatedPersonel = { ...personelToUpdate, [field]: checked }
        const updatedList = await updatePersonel(updatedPersonel)
        setPersonelList(updatedList)
      }
    } catch (error) {
      console.error("Personel güncellenirken hata oluştu:", error)
      toast({
        title: "Hata",
        description: "Personel güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.name.endsWith(".csv")) {
        try {
          const reader = new FileReader()
          reader.onload = async (e) => {
            try {
              const content = e.target?.result as string
              console.log("File content:", content) // Log file content for debugging
              // Remove BOM if present and split by newlines
              const cleanContent = content.replace(/^\uFEFF/, "")
              const rows = cleanContent
                .split(/\r?\n/)
                .map((row) => row.trim())
                .filter((row) => row.length > 0)

              console.log("Processed rows:", rows) // Log processed rows for debugging

              if (rows.length < 2) {
                throw new Error("CSV dosyası boş veya sadece başlık satırı içeriyor.")
              }

              const headers = rows[0].split(",").map((h) => h.trim())
              console.log("Headers:", headers) // Log headers for debugging
              if (headers.length !== 8) {
                throw new Error(`Geçersiz CSV formatı. Beklenen sütun sayısı: 8, Bulunan: ${headers.length}`)
              }

              const newPersonelList: Partial<Personel>[] = []

              // Process each data row
              for (let i = 1; i < rows.length; i++) {
                const row = rows[i]
                const values = row.split(",").map((v) => v.trim())
                console.log(`Row ${i} values:`, values) // Log each row's values for debugging

                if (values.length !== 8) {
                  throw new Error(`Satır ${i + 1}: Geçersiz sütun sayısı. Beklenen: 8, Bulunan: ${values.length}`)
                }

                const [tc, ad, soyad, departman, unvan, klinik, mesaiTamamlama, mesaiDisiCalisir] = values

                // Remove any quotes from clinic number
                const cleanKlinik = klinik.replace(/['"]/g, "")

                if (!tc || !ad || !soyad || !departman || !unvan || !cleanKlinik) {
                  throw new Error(`Satır ${i + 1}: Eksik veri. Tüm zorunlu alanlar doldurulmalıdır.`)
                }

                newPersonelList.push({
                  tc,
                  ad,
                  soyad,
                  departman,
                  unvan,
                  klinik: cleanKlinik,
                  mesaiTamamlama: mesaiTamamlama.toLowerCase() === "true",
                  mesaiDisiCalisir: mesaiDisiCalisir.toLowerCase() === "true",
                })
              }

              console.log("New personnel list:", newPersonelList) // Log the new personnel list for debugging

              // Add each person one by one
              for (const newPersonel of newPersonelList) {
                try {
                  await addPersonel(newPersonel)
                } catch (error) {
                  console.error("Personel eklenirken hata:", error)
                  throw new Error(`TC: ${newPersonel.tc} olan personel eklenirken hata oluştu.`)
                }
              }

              const updatedList = await getPersoneller()
              setPersonelList(updatedList)

              toast({
                title: "Başarılı",
                description: `${newPersonelList.length} personel başarıyla eklendi.`,
              })

              // Clear the file input
              if (fileInputRef.current) {
                fileInputRef.current.value = ""
              }

              setIsUploadModalOpen(false)
            } catch (error) {
              console.error("CSV işleme hatası:", error)
              toast({
                title: "Hata",
                description: error instanceof Error ? error.message : "CSV dosyası işlenirken bir hata oluştu.",
                variant: "destructive",
              })
            }
          }

          reader.onerror = (error) => {
            console.error("Dosya okuma hatası:", error)
            toast({
              title: "Hata",
              description: "Dosya okunurken bir hata oluştu.",
              variant: "destructive",
            })
          }

          reader.readAsText(file, "UTF-8")
        } catch (error) {
          console.error("Dosya işleme hatası:", error)
          toast({
            title: "Hata",
            description: "Dosya işlenirken bir hata oluştu.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Hata",
          description: "Lütfen geçerli bir CSV dosyası (.csv) yükleyin.",
          variant: "destructive",
        })
      }
    }
  }

  const handleTemplateDownload = () => {
    const BOM = "\uFEFF"
    const csvContent = generateCSVTemplate()
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "personel_sablonu.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleSubmit = async (data: Partial<Personel>) => {
    try {
      let updatedList
      if (editingPersonel) {
        updatedList = await updatePersonel({ ...editingPersonel, ...data })
        toast({
          title: "Başarılı",
          description: "Personel bilgileri güncellendi.",
        })
      } else {
        updatedList = await addPersonel(data)
        toast({
          title: "Başarılı",
          description: "Yeni personel eklendi.",
        })
      }
      setPersonelList(updatedList)
      setIsModalOpen(false)
      setEditingPersonel(null)
    } catch (error) {
      console.error("Personel işlemi sırasında hata:", error)
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const sortedPersonel = [...filteredPersonel] // filteredPersonel kullanımı
    .sort((a, b) => {
      if (!sortConfig) return 0
      const { key, direction } = sortConfig
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1
      return 0
    })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Personel Listesi</h1>
        <div className="space-y-2 flex flex-col items-end">
          <div className="flex items-center space-x-2">
            <Dialog
              open={isModalOpen}
              onOpenChange={(open) => {
                setIsModalOpen(open)
                if (!open) setEditingPersonel(null)
              }}
            >
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingPersonel(null)
                    setIsModalOpen(true)
                  }}
                  className="bg-[#0f172a] hover:bg-[#1e293b]"
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Yeni Personel Ekle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingPersonel ? "Personel Düzenle" : "Yeni Personel Ekle"}</DialogTitle>
                  <DialogDescription>
                    {editingPersonel
                      ? "Personel bilgilerini güncellemek için formu kullanın."
                      : "Yeni personel eklemek için formu doldurun."}
                  </DialogDescription>
                </DialogHeader>
                <PersonelForm
                  key={editingPersonel ? editingPersonel.id : "new"}
                  onSubmit={handleSubmit}
                  initialData={editingPersonel}
                />
              </DialogContent>
            </Dialog>
            <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setIsUploadModalOpen(true)}
                  variant="default"
                  className="bg-[#0f172a] hover:bg-[#1e293b]"
                >
                  <Upload className="mr-2 h-4 w-4" /> Toplu Personel Aktar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Toplu Personel Aktarımı</DialogTitle>
                  <DialogDescription>
                    İndirdiğiniz şablonu doldurup yükleyerek toplu personel aktarımı yapabilirsiniz. Şablon kullanımı
                    hakkında detaylı bilgi için{" "}
                    <a href="/personel-yonetimi/sablon-kullanimi" className="text-primary hover:underline">
                      tıklayınız
                    </a>
                    .
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <Input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="flex-1" />
                  <Button onClick={() => fileInputRef.current?.click()}>Dosya Seç</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              onClick={handleTemplateDownload}
              variant="outline"
              className="bg-white text-[#0f172a] border-[#0f172a] hover:bg-[#f8fafc]"
            >
              <Download className="mr-2 h-4 w-4" /> Şablon İndir
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <Input
          placeholder="TC, Ad, Soyad, Departman, Unvan veya Klinik ile arama yapın..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">#</TableHead>
              <TableHead className="text-center cursor-pointer" onClick={() => handleSort("tc")}>
                T.C. {sortConfig?.key === "tc" && <ArrowUpDown className="inline ml-2 h-4 w-4" />}
              </TableHead>
              <TableHead className="text-center cursor-pointer" onClick={() => handleSort("ad")}>
                Ad {sortConfig?.key === "ad" && <ArrowUpDown className="inline ml-2 h-4 w-4" />}
              </TableHead>
              <TableHead className="text-center cursor-pointer" onClick={() => handleSort("soyad")}>
                Soyad {sortConfig?.key === "soyad" && <ArrowUpDown className="inline ml-2 h-4 w-4" />}
              </TableHead>
              <TableHead className="text-center cursor-pointer" onClick={() => handleSort("departman")}>
                Departman {sortConfig?.key === "departman" && <ArrowUpDown className="inline ml-2 h-4 w-4" />}
              </TableHead>
              <TableHead className="text-center cursor-pointer" onClick={() => handleSort("unvan")}>
                Unvan {sortConfig?.key === "unvan" && <ArrowUpDown className="inline ml-2 h-4 w-4" />}
              </TableHead>
              <TableHead className="text-center cursor-pointer" onClick={() => handleSort("klinik")}>
                Klinik {sortConfig?.key === "klinik" && <ArrowUpDown className="inline ml-2 h-4 w-4" />}
              </TableHead>
              <TableHead className="text-center cursor-pointer" onClick={() => handleSort("mesaiTamamlama")}>
                Mesai Tamamlama{" "}
                {sortConfig?.key === "mesaiTamamlama" && <ArrowUpDown className="inline ml-2 h-4 w-4" />}
              </TableHead>
              <TableHead className="text-center cursor-pointer" onClick={() => handleSort("mesaiDisiCalisir")}>
                Mesai Dışı Çalışır{" "}
                {sortConfig?.key === "mesaiDisiCalisir" && <ArrowUpDown className="inline ml-2 h-4 w-4" />}
              </TableHead>
              <TableHead className="text-center">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPersonel.map((personel, index) => (
              <TableRow key={personel.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{personel.tc}</TableCell>
                <TableCell className="text-center">{personel.ad}</TableCell>
                <TableCell className="text-center">{personel.soyad}</TableCell>
                <TableCell className="text-center">{personel.departman}</TableCell>
                <TableCell className="text-center">{personel.unvan}</TableCell>
                <TableCell className="text-center">{personel.klinik}</TableCell>
                <TableCell className="text-center">
                  {(personel.unvan === "Klinik Destek Personeli" || personel.unvan === "Veri Giriş Personeli") && (
                    <div className="flex justify-center">
                      <Switch
                        checked={personel.mesaiTamamlama}
                        onCheckedChange={(checked) => handleSwitchChange(personel.id, "mesaiTamamlama", checked)}
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {(personel.unvan === "Diş Tabibi" || personel.unvan === "Uzm. Diş Tabibi") && (
                    <div className="flex justify-center">
                      <Switch
                        checked={personel.mesaiDisiCalisir}
                        onCheckedChange={(checked) => handleSwitchChange(personel.id, "mesaiDisiCalisir", checked)}
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(personel.id)}>
                    Düzenle
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(personel.id)}>
                    Sil
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

