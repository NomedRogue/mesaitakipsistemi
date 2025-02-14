"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, CalendarPlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { IzinForm } from "./izin-form"
import { differenceInDays, parseISO } from "date-fns"
import { getPersoneller, getIzinler, addIzin, updateIzin, deleteIzin } from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface Izin {
  id: number
  personelId: number
  ad: string
  soyad: string
  izinTuru: string
  baslangicTarihi: string
  bitisTarihi: string
  gun: number
}

interface Personel {
  id: number
  tc: string
  ad: string
  soyad: string
  departman: string
  unvan: string
  klinik: string
}

export default function IzinYonetimi() {
  const [izinListesi, setIzinListesi] = useState<Izin[]>([])
  const [personelListesi, setPersonelListesi] = useState<Personel[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: keyof Izin | null; direction: "ascending" | "descending" }>({
    key: null,
    direction: "ascending",
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIzin, setEditingIzin] = useState<Izin | null>(null)
  const [selectedPersonelId, setSelectedPersonelId] = useState<number | null>(null)

  useEffect(() => {
    const fetchIzinler = async () => {
      try {
        const data = await getIzinler()
        console.log("Fetched izinler:", data)
        setIzinListesi(data)
      } catch (error) {
        console.error("İzin verileri alınırken hata oluştu:", error)
        toast({
          title: "Hata",
          description: "İzin verileri alınırken bir hata oluştu.",
          variant: "destructive",
        })
      }
    }
    fetchIzinler()

    const fetchPersonel = async () => {
      try {
        const data = await getPersoneller()
        setPersonelListesi(data)
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

  const handleSort = (key: keyof Izin) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction: direction as "ascending" | "descending" })
  }

  const calculateGun = (baslangic: string, bitis: string) => {
    return differenceInDays(parseISO(bitis), parseISO(baslangic)) + 1
  }

  const handleSubmit = async (data: Partial<Izin>) => {
    try {
      const selectedPersonel = personelListesi.find((p) => p.id === selectedPersonelId)
      if (!selectedPersonel) {
        toast({
          title: "Hata",
          description: "Lütfen bir personel seçin.",
          variant: "destructive",
        })
        return
      }

      const gun = calculateGun(data.baslangicTarihi!, data.bitisTarihi!)

      let updatedIzinListesi: Izin[]

      if (editingIzin) {
        updatedIzinListesi = await updateIzin({
          ...editingIzin,
          ...data,
          gun,
          personelId: selectedPersonel.id,
          ad: selectedPersonel.ad,
          soyad: selectedPersonel.soyad,
        })
      } else {
        const newIzin: Izin = {
          id: Date.now(),
          personelId: selectedPersonel.id,
          ad: selectedPersonel.ad,
          soyad: selectedPersonel.soyad,
          izinTuru: data.izinTuru!,
          baslangicTarihi: data.baslangicTarihi!,
          bitisTarihi: data.bitisTarihi!,
          gun,
        }
        updatedIzinListesi = await addIzin(newIzin)
      }

      console.log("Updated izin listesi:", updatedIzinListesi)
      setIzinListesi(updatedIzinListesi)
      setIsModalOpen(false)
      setEditingIzin(null)
      setSelectedPersonelId(null)

      toast({
        title: "Başarılı",
        description: editingIzin ? "İzin güncellendi." : "Yeni izin eklendi.",
      })
    } catch (error) {
      console.error("İzin eklenirken/güncellenirken hata oluştu:", error)
      toast({
        title: "Hata",
        description: "İzin eklenirken/güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (izin: Izin) => {
    setEditingIzin(izin)
    setSelectedPersonelId(izin.personelId)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const updatedList = await deleteIzin(id)
      console.log("Updated list after delete:", updatedList)
      setIzinListesi(updatedList)
      toast({
        title: "Başarılı",
        description: "İzin başarıyla silindi.",
      })
    } catch (error) {
      console.error("İzin silinirken hata oluştu:", error)
      toast({
        title: "Hata",
        description: "İzin silinirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const sortedIzinler = [...izinListesi]
    .filter((izin) => {
      const searchValue = searchTerm.toLowerCase()
      return (
        izin.ad.toLowerCase().includes(searchValue) ||
        izin.soyad.toLowerCase().includes(searchValue) ||
        izin.izinTuru.toLowerCase().includes(searchValue)
      )
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0

      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">İzin Yönetimi</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingIzin(null)
                setSelectedPersonelId(null)
                setIsModalOpen(true)
              }}
              className="bg-[#0f172a] hover:bg-[#1e293b] h-10"
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              İzin Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingIzin ? "İzin Düzenle" : "İzin Ekle"}</DialogTitle>
              <DialogDescription>
                {editingIzin
                  ? "İzin bilgilerini güncellemek için formu kullanın."
                  : "Yeni izin eklemek için formu doldurun."}
              </DialogDescription>
            </DialogHeader>
            <Select
              value={selectedPersonelId?.toString() || ""}
              onValueChange={(value) => setSelectedPersonelId(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Personel seçin" />
              </SelectTrigger>
              <SelectContent>
                {personelListesi.map((personel) => (
                  <SelectItem key={personel.id} value={personel.id.toString()}>
                    {personel.ad} {personel.soyad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPersonelId && (
              <IzinForm
                onSubmit={handleSubmit}
                initialData={editingIzin}
                personelAd={personelListesi.find((p) => p.id === selectedPersonelId)?.ad || ""}
                personelSoyad={personelListesi.find((p) => p.id === selectedPersonelId)?.soyad || ""}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Input
          placeholder="İzin ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center cursor-pointer" onClick={() => handleSort("ad")}>
              Ad {sortConfig.key === "ad" && <ArrowUpDown className="inline ml-2 h-4 w-4" />}
            </TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => handleSort("soyad")}>
              Soyad {sortConfig.key === "soyad" && <ArrowUpDown className="inline ml-2 h-4 w-4" />}
            </TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => handleSort("izinTuru")}>
              İzin Türü {sortConfig.key === "izinTuru" && <ArrowUpDown className="inline ml-2 h-4 w-4" />}
            </TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => handleSort("baslangicTarihi")}>
              Başlangıç {sortConfig.key === "baslangicTarihi" && <ArrowUpDown className="inline ml-2 h-4 w-4" />}
            </TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => handleSort("bitisTarihi")}>
              Bitiş {sortConfig.key === "bitisTarihi" && <ArrowUpDown className="inline ml-2 h-4 w-4" />}
            </TableHead>
            <TableHead className="text-center cursor-pointer" onClick={() => handleSort("gun")}>
              Gün {sortConfig.key === "gun" && <ArrowUpDown className="inline ml-2 h-4 w-4" />}
            </TableHead>
            <TableHead className="text-center">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedIzinler.map((izin) => (
            <TableRow key={izin.id}>
              <TableCell className="text-center">{izin.ad}</TableCell>
              <TableCell className="text-center">{izin.soyad}</TableCell>
              <TableCell className="text-center">{izin.izinTuru}</TableCell>
              <TableCell className="text-center">{izin.baslangicTarihi}</TableCell>
              <TableCell className="text-center">{izin.bitisTarihi}</TableCell>
              <TableCell className="text-center">
                <Badge variant="outline">{izin.gun}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(izin)}>
                  Düzenle
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(izin.id)}>
                  Sil
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

