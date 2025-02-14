"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getPersoneller, addMTPPlan, savePeriodData, getPeriodData, deletePeriodData } from "@/lib/api"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

export default function MesaiPlani() {
  const [personelListesi, setPersonelListesi] = useState<Personel[]>([])
  const [filteredPersonel, setFilteredPersonel] = useState<Personel[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: keyof Personel; direction: "ascending" | "descending" } | null>(
    null,
  )
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, "0"))
  const [isDonemCreated, setIsDonemCreated] = useState<boolean>(false)
  const [isDonemApproved, setIsDonemApproved] = useState(false)
  const [isDonemFinalized, setIsDonemFinalized] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const periodData = getPeriodData(selectedYear, selectedMonth)
        if (periodData && periodData.personnel && periodData.personnel.length > 0) {
          setPersonelListesi(periodData.personnel)
          setFilteredPersonel(periodData.personnel)
          setIsDonemCreated(true)
          setIsDonemApproved(periodData.isApproved || false)
          setIsDonemFinalized(periodData.isFinalized || false)
        } else {
          setPersonelListesi([])
          setFilteredPersonel([])
          setIsDonemCreated(false)
          setIsDonemApproved(false)
          setIsDonemFinalized(false)
        }
      } catch (error) {
        console.error("MTP Planları yüklenirken bir hata oluştu:", error)
        setIsDonemCreated(false)
        toast({
          title: "Hata",
          description: "MTP Planları yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [selectedYear, selectedMonth])

  const handleSort = (key: keyof Personel) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const sortedPersonel = [...filteredPersonel].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig

    if (key === "mesaiTamamlama" || key === "mesaiDisiCalisir") {
      if (a[key] === b[key]) return 0
      if (direction === "ascending") {
        return a[key] ? -1 : 1
      } else {
        return a[key] ? 1 : -1
      }
    }

    if (a[key] < b[key]) return direction === "ascending" ? -1 : 1
    if (a[key] > b[key]) return direction === "ascending" ? 1 : -1
    return 0
  })

  const handleCreatePeriod = async () => {
    try {
      const allPersonel = await getPersoneller()
      const filteredPersonel = allPersonel.filter((p: Personel) => p.mesaiTamamlama || p.mesaiDisiCalisir)
      setPersonelListesi(filteredPersonel)
      setFilteredPersonel(filteredPersonel)

      const newPlan = {
        year: selectedYear,
        month: selectedMonth,
        personnel: filteredPersonel,
        isApproved: false,
        isFinalized: false,
      }

      await addMTPPlan(newPlan)
      savePeriodData(selectedYear, selectedMonth, newPlan)

      setIsDonemCreated(true)
      setIsDonemApproved(false)
      setIsDonemFinalized(false)
      console.log(`Dönem oluşturuldu: ${selectedYear}-${selectedMonth}`)
      console.log(`Toplam personel sayısı: ${filteredPersonel.length}`)

      toast({
        title: "Başarılı",
        description: "MTP Plan başarıyla oluşturuldu ve kaydedildi.",
      })
    } catch (error) {
      console.error("Dönem oluşturulurken bir hata oluştu:", error)
      toast({
        title: "Hata",
        description: "MTP Plan oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleUndoPeriod = () => {
    try {
      deletePeriodData(selectedYear, selectedMonth)
      setPersonelListesi([])
      setFilteredPersonel([])
      setIsDonemCreated(false)
      setIsDonemApproved(false)
      setIsDonemFinalized(false)
      toast({
        title: "Başarılı",
        description: "Dönem başarıyla geri alındı.",
      })
    } catch (error) {
      console.error("Dönem geri alınırken bir hata oluştu:", error)
      toast({
        title: "Hata",
        description: "Dönem geri alınırken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleApprovePeriod = () => {
    try {
      const periodData = getPeriodData(selectedYear, selectedMonth)
      if (periodData) {
        const updatedPeriodData = { ...periodData, isApproved: true }
        savePeriodData(selectedYear, selectedMonth, updatedPeriodData)
        setIsDonemApproved(true)
        toast({
          title: "Başarılı",
          description: "Dönem başarıyla onaylandı.",
        })
      } else {
        throw new Error("Dönem verisi bulunamadı")
      }
    } catch (error) {
      console.error("Dönem onaylanırken bir hata oluştu:", error)
      toast({
        title: "Hata",
        description: "Dönem onaylanırken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleUnapprovePeriod = () => {
    try {
      const periodData = getPeriodData(selectedYear, selectedMonth)
      if (periodData) {
        const updatedPeriodData = { ...periodData, isApproved: false }
        savePeriodData(selectedYear, selectedMonth, updatedPeriodData)
        setIsDonemApproved(false)
        toast({
          title: "Başarılı",
          description: "Dönem onayı başarıyla kaldırıldı.",
        })
      } else {
        throw new Error("Dönem verisi bulunamadı")
      }
    } catch (error) {
      console.error("Dönem onayı kaldırılırken bir hata oluştu:", error)
      toast({
        title: "Hata",
        description: "Dönem onayı kaldırılırken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleFinalizePeriod = () => {
    try {
      const periodData = getPeriodData(selectedYear, selectedMonth)
      if (periodData) {
        const updatedPeriodData = { ...periodData, isFinalized: true }
        savePeriodData(selectedYear, selectedMonth, updatedPeriodData)
        setIsDonemFinalized(true)
        toast({
          title: "Başarılı",
          description: "Dönem başarıyla kesinleştirildi.",
        })
      } else {
        throw new Error("Dönem verisi bulunamadı")
      }
    } catch (error) {
      console.error("Dönem kesinleştirilirken bir hata oluştu:", error)
      toast({
        title: "Hata",
        description: "Dönem kesinleştirilirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleUnfinalizePeriod = () => {
    try {
      const periodData = getPeriodData(selectedYear, selectedMonth)
      if (periodData) {
        const updatedPeriodData = { ...periodData, isFinalized: false }
        savePeriodData(selectedYear, selectedMonth, updatedPeriodData)
        setIsDonemFinalized(false)
        toast({
          title: "Başarılı",
          description: "Dönem kesinleştirmesi başarıyla kaldırıldı.",
        })
      } else {
        throw new Error("Dönem verisi bulunamadı")
      }
    } catch (error) {
      console.error("Dönem kesinleştirmesi kaldırılırken bir hata oluştu:", error)
      toast({
        title: "Hata",
        description: "Dönem kesinleştirmesi kaldırılırken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const lowercasedSearch = searchTerm.toLowerCase()
    const filtered = personelListesi.filter(
      (personel) =>
        personel.tc.toLowerCase().includes(lowercasedSearch) ||
        personel.ad.toLowerCase().includes(lowercasedSearch) ||
        personel.soyad.toLowerCase().includes(lowercasedSearch) ||
        personel.departman.toLowerCase().includes(lowercasedSearch) ||
        personel.unvan.toLowerCase().includes(lowercasedSearch) ||
        personel.klinik.toLowerCase().includes(lowercasedSearch),
    )
    setFilteredPersonel(filtered)
  }, [searchTerm, personelListesi])

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => (currentYear + i).toString())
  const months = [
    { value: "01", label: "Ocak" },
    { value: "02", label: "Şubat" },
    { value: "03", label: "Mart" },
    { value: "04", label: "Nisan" },
    { value: "05", label: "Mayıs" },
    { value: "06", label: "Haziran" },
    { value: "07", label: "Temmuz" },
    { value: "08", label: "Ağustos" },
    { value: "09", label: "Eylül" },
    { value: "10", label: "Ekim" },
    { value: "11", label: "Kasım" },
    { value: "12", label: "Aralık" },
  ]

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 mb-6">
        <h1 className="text-2xl font-bold">Mesai Tamamlama Planı Hazırla</h1>
        <div className="flex flex-wrap items-center gap-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Yıl Seçin" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ay Seçin" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    onClick={isDonemCreated ? handleUndoPeriod : handleCreatePeriod}
                    className="bg-[#0f172a] hover:bg-[#1e293b] w-[180px]"
                    disabled={isDonemFinalized || isDonemApproved}
                  >
                    {isDonemCreated ? "Geri Al" : "Dönem Oluştur"}
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {isDonemFinalized
                  ? "Dönem kesinleştirildiği için geri alınamaz."
                  : isDonemCreated && isDonemApproved
                    ? "Dönem onaylandığı için geri alınamaz."
                    : isDonemCreated
                      ? "Dönemi geri al"
                      : "Yeni dönem oluştur"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            onClick={isDonemApproved ? handleUnapprovePeriod : handleApprovePeriod}
            className="bg-[#0f172a] hover:bg-[#1e293b] w-[180px]"
            disabled={!isDonemCreated || isDonemFinalized}
          >
            {isDonemApproved ? "Onayı Kaldır" : "Dönem Onayla"}
          </Button>
          <Button
            onClick={handleFinalizePeriod}
            className="bg-[#0f172a] hover:bg-[#1e293b] w-[180px]"
            disabled={!isDonemApproved || isDonemFinalized}
          >
            Dönem Kesinleştir
          </Button>
          {isDonemFinalized && (
            <Button onClick={handleUnfinalizePeriod} className="bg-[#0f172a] hover:bg-[#1e293b] w-[180px]">
              Kesinleştirmeyi Kaldır
            </Button>
          )}
          <Input
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {personelListesi.length === 0 ? (
        <div className="text-center py-4">Lütfen bir dönem oluşturun.</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {(
                  ["tc", "ad", "soyad", "departman", "unvan", "klinik", "mesaiTamamlama", "mesaiDisiCalisir"] as const
                ).map((key) => (
                  <TableHead key={key} className="text-center">
                    <Button variant="ghost" onClick={() => handleSort(key)} className="hover:bg-transparent">
                      {key === "tc"
                        ? "T.C."
                        : key === "departman"
                          ? "Departman"
                          : key === "mesaiTamamlama"
                            ? "Mesai Tamamlama"
                            : key === "mesaiDisiCalisir"
                              ? "Mesai Dışı Çalışır"
                              : key.charAt(0).toUpperCase() + key.slice(1)}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPersonel.map((personel) => (
                <TableRow key={personel.id}>
                  <TableCell className="text-center">{personel.tc}</TableCell>
                  <TableCell className="font-medium text-center">{personel.ad}</TableCell>
                  <TableCell className="text-center">{personel.soyad}</TableCell>
                  <TableCell className="text-center">{personel.departman}</TableCell>
                  <TableCell className="text-center">{personel.unvan}</TableCell>
                  <TableCell className="text-center">{personel.klinik}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={personel.mesaiTamamlama ? "default" : "secondary"}>
                      {personel.mesaiTamamlama ? "Evet" : "Hayır"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={personel.mesaiDisiCalisir ? "default" : "secondary"}>
                      {personel.mesaiDisiCalisir ? "Evet" : "Hayır"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

