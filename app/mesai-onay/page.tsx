"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Check, X } from "lucide-react"
import { getMTPOnaylar, updateMTPOnay } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

interface MesaiPlan {
  id: number
  tarih: string
  personelAdi: string
  personelSoyadi: string
  departman: string
  mesaiSuresi: number
  onayDurumu: "Beklemede" | "Onaylandı" | "Reddedildi"
}

export default function MTPOnay() {
  const [mesaiPlanlari, setMesaiPlanlari] = useState<MesaiPlan[]>([])
  const [filteredPlans, setFilteredPlans] = useState<MesaiPlan[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: keyof MesaiPlan; direction: "ascending" | "descending" } | null>(
    null,
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const onaylar = await getMTPOnaylar()
        setMesaiPlanlari(onaylar)
      } catch (error) {
        console.error("MTP Onayları yüklenirken bir hata oluştu:", error)
        toast({
          title: "Hata",
          description: "MTP Onayları yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase()
      const filtered = mesaiPlanlari.filter(
        (plan) =>
          plan.personelAdi.toLowerCase().includes(lowercasedSearch) ||
          plan.personelSoyadi.toLowerCase().includes(lowercasedSearch) ||
          plan.departman.toLowerCase().includes(lowercasedSearch) ||
          plan.tarih.includes(lowercasedSearch),
      )
      setFilteredPlans(filtered)
    } else {
      setFilteredPlans(mesaiPlanlari)
    }
  }, [searchTerm, mesaiPlanlari])

  const handleSort = (key: keyof MesaiPlan) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const handleApprove = async (id: number) => {
    try {
      const updatedPlan = mesaiPlanlari.find((plan) => plan.id === id)
      if (updatedPlan) {
        const updatedApproval = await updateMTPOnay({ ...updatedPlan, onayDurumu: "Onaylandı" })
        setMesaiPlanlari(mesaiPlanlari.map((plan) => (plan.id === id ? updatedApproval : plan)))
        toast({
          title: "Başarılı",
          description: "MTP Onaylandı.",
        })
      }
    } catch (error) {
      console.error("MTP Onaylanırken bir hata oluştu:", error)
      toast({
        title: "Hata",
        description: "MTP Onaylanırken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (id: number) => {
    try {
      const updatedPlan = mesaiPlanlari.find((plan) => plan.id === id)
      if (updatedPlan) {
        const updatedApproval = await updateMTPOnay({ ...updatedPlan, onayDurumu: "Reddedildi" })
        setMesaiPlanlari(mesaiPlanlari.map((plan) => (plan.id === id ? updatedApproval : plan)))
        toast({
          title: "Başarılı",
          description: "MTP Reddedildi.",
        })
      }
    } catch (error) {
      console.error("MTP Reddedilirken bir hata oluştu:", error)
      toast({
        title: "Hata",
        description: "MTP Reddedilirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Mesai Tamamlama Onay</h1>
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">
                <Button variant="ghost" onClick={() => handleSort("tarih")} className="hover:bg-transparent">
                  Tarih
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button variant="ghost" onClick={() => handleSort("personelAdi")} className="hover:bg-transparent">
                  Personel Adı
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button variant="ghost" onClick={() => handleSort("personelSoyadi")} className="hover:bg-transparent">
                  Personel Soyadı
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button variant="ghost" onClick={() => handleSort("departman")} className="hover:bg-transparent">
                  Departman
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button variant="ghost" onClick={() => handleSort("mesaiSuresi")} className="hover:bg-transparent">
                  Mesai Süresi (Saat)
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button variant="ghost" onClick={() => handleSort("onayDurumu")} className="hover:bg-transparent">
                  Onay Durumu
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-center">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="text-center">{plan.tarih}</TableCell>
                <TableCell className="text-center">{plan.personelAdi}</TableCell>
                <TableCell className="text-center">{plan.personelSoyadi}</TableCell>
                <TableCell className="text-center">{plan.departman}</TableCell>
                <TableCell className="text-center">{plan.mesaiSuresi}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      plan.onayDurumu === "Onaylandı"
                        ? "default"
                        : plan.onayDurumu === "Reddedildi"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {plan.onayDurumu}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {plan.onayDurumu === "Beklemede" && (
                    <>
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => handleApprove(plan.id)}>
                        <Check className="mr-2 h-4 w-4" />
                        Onayla
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleReject(plan.id)}>
                        <X className="mr-2 h-4 w-4" />
                        Reddet
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

