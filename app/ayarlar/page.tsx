"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getPersoneller } from "@/lib/api"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getAyarlar, updateAyarlar } from "@/lib/api"

const weekdays = [
  { id: "pazartesi", label: "Pazartesi" },
  { id: "sali", label: "Salı" },
  { id: "carsamba", label: "Çarşamba" },
  { id: "persembe", label: "Perşembe" },
  { id: "cuma", label: "Cuma" },
]

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0")
  return { value: `${hour}:00`, label: `${hour}:00` }
})

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

interface IncompatibleStaff {
  staffId: number
  incompatibleDoctors: number[]
}

interface Settings {
  mesaiDisiCalismaGunleri: string[]
  mesaiDisiCalismaSaatleri: {
    baslangic: string
    bitis: string
  }
  uyumsuzPersonel: IncompatibleStaff[]
}

const defaultSettings: Settings = {
  mesaiDisiCalismaGunleri: [],
  mesaiDisiCalismaSaatleri: {
    baslangic: "17:00",
    bitis: "08:00",
  },
  uyumsuzPersonel: [],
}

export default function AyarlarPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [clinicSupportStaff, setClinicSupportStaff] = useState<Personel[]>([])
  const [doctors, setDoctors] = useState<Personel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMessage, setDialogMessage] = useState({ title: "", description: "" })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const storedSettings = await getAyarlar()
        if (Object.keys(storedSettings).length > 0) {
          setSettings(storedSettings)
        }

        const personnelData = await getPersoneller()
        const supportStaff = personnelData.filter((p: Personel) => p.unvan === "Klinik Destek Personeli")
        const doctorsList = personnelData.filter(
          (p: Personel) => p.unvan === "Diş Tabibi" || p.unvan === "Uzm. Diş Tabibi",
        )

        setClinicSupportStaff(supportStaff)
        setDoctors(doctorsList)
        setLoading(false)
      } catch (err) {
        setError(`Veriler yüklenirken bir hata oluştu: ${err instanceof Error ? err.message : String(err)}`)
        setLoading(false)
        console.error("Error fetching data:", err)
      }
    }

    fetchData()
  }, [])

  const handleDayToggle = (day: string) => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        mesaiDisiCalismaGunleri: prev.mesaiDisiCalismaGunleri.includes(day)
          ? prev.mesaiDisiCalismaGunleri.filter((d) => d !== day)
          : [...prev.mesaiDisiCalismaGunleri, day],
      }
      localStorage.setItem("settings", JSON.stringify(newSettings))
      return newSettings
    })
  }

  const handleTimeChange = (type: "baslangic" | "bitis", value: string) => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        mesaiDisiCalismaSaatleri: {
          ...prev.mesaiDisiCalismaSaatleri,
          [type]: value,
        },
      }
      localStorage.setItem("settings", JSON.stringify(newSettings))
      return newSettings
    })
  }

  const handleStaffSelect = (staffId: number) => {
    setSettings((prev) => {
      const staffIndex = prev.uyumsuzPersonel.findIndex((staff) => staff.staffId === staffId)
      let newUyumsuzPersonel
      if (staffIndex !== -1) {
        newUyumsuzPersonel = prev.uyumsuzPersonel.filter((staff) => staff.staffId !== staffId)
      } else {
        newUyumsuzPersonel = [...prev.uyumsuzPersonel, { staffId, incompatibleDoctors: [] }]
      }
      const newSettings = {
        ...prev,
        uyumsuzPersonel: newUyumsuzPersonel,
      }
      localStorage.setItem("settings", JSON.stringify(newSettings))
      return newSettings
    })
  }

  const handleDoctorToggle = (staffId: number, doctorId: number) => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        uyumsuzPersonel: prev.uyumsuzPersonel.map((staff) => {
          if (staff.staffId === staffId) {
            const doctorIndex = staff.incompatibleDoctors.indexOf(doctorId)
            if (doctorIndex !== -1) {
              return {
                ...staff,
                incompatibleDoctors: staff.incompatibleDoctors.filter((id) => id !== doctorId),
              }
            } else {
              return {
                ...staff,
                incompatibleDoctors: [...staff.incompatibleDoctors, doctorId],
              }
            }
          }
          return staff
        }),
      }
      localStorage.setItem("settings", JSON.stringify(newSettings))
      return newSettings
    })
  }

  const handleSave = async () => {
    if (settings.mesaiDisiCalismaGunleri.length === 0) {
      setDialogMessage({
        title: "Hata",
        description: "En az bir gün seçmelisiniz.",
      })
      setIsDialogOpen(true)
      return
    }

    try {
      await updateAyarlar(settings)
      setDialogMessage({
        title: "Başarılı",
        description: "Ayarlar başarıyla kaydedildi.",
      })
    } catch (error) {
      setDialogMessage({
        title: "Hata",
        description: "Ayarlar kaydedilirken bir hata oluştu.",
      })
    }
    setIsDialogOpen(true)
  }

  if (loading) {
    return <div className="p-6">Yükleniyor...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">Hata: {error}</div>
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Ayarlar</h1>

      <Card>
        <CardHeader>
          <CardTitle>Mesai Dışı Çalışma Günleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {weekdays.map((day) => (
              <div key={day.id} className="flex items-center space-x-2">
                <Checkbox
                  id={day.id}
                  checked={settings.mesaiDisiCalismaGunleri.includes(day.id)}
                  onCheckedChange={() => handleDayToggle(day.id)}
                  disabled={
                    settings.mesaiDisiCalismaGunleri.length >= 5 && !settings.mesaiDisiCalismaGunleri.includes(day.id)
                  }
                />
                <Label htmlFor={day.id}>{day.label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mesai Dışı Çalışma Saatleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Başlangıç Saati</Label>
              <Select
                value={settings.mesaiDisiCalismaSaatleri.baslangic}
                onValueChange={(value) => handleTimeChange("baslangic", value)}
              >
                <SelectTrigger id="startTime" className="w-[180px]">
                  <SelectValue placeholder="Başlangıç saati seçin" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Bitiş Saati</Label>
              <Select
                value={settings.mesaiDisiCalismaSaatleri.bitis}
                onValueChange={(value) => handleTimeChange("bitis", value)}
              >
                <SelectTrigger id="endTime" className="w-[180px]">
                  <SelectValue placeholder="Bitiş saati seçin" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uyumsuz Personel</CardTitle>
          <CardDescription>Klinik destek personeli ile uyumsuz olan tabipleri seçin.</CardDescription>
        </CardHeader>
        <CardContent>
          {clinicSupportStaff.length === 0 ? (
            <div className="text-center py-4">Klinik destek personeli bulunamadı.</div>
          ) : (
            <div className="space-y-4">
              {clinicSupportStaff.map((staff) => (
                <div key={staff.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`staff-${staff.id}`}
                      checked={settings.uyumsuzPersonel.some((s) => s.staffId === staff.id)}
                      onCheckedChange={() => handleStaffSelect(staff.id)}
                    />
                    <Label htmlFor={`staff-${staff.id}`}>{`${staff.ad} ${staff.soyad}`}</Label>
                  </div>
                  {settings.uyumsuzPersonel.some((s) => s.staffId === staff.id) && (
                    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
                      <div className="space-y-2">
                        {doctors.length === 0 ? (
                          <div className="text-center py-2">Tabip bulunamadı.</div>
                        ) : (
                          doctors.map((doctor) => (
                            <div key={doctor.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${staff.id}-${doctor.id}`}
                                checked={settings.uyumsuzPersonel
                                  .find((s) => s.staffId === staff.id)
                                  ?.incompatibleDoctors.includes(doctor.id)}
                                onCheckedChange={() => handleDoctorToggle(staff.id, doctor.id)}
                              />
                              <Label htmlFor={`${staff.id}-${doctor.id}`}>
                                {`${doctor.ad} ${doctor.soyad} (${doctor.unvan})`}
                              </Label>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="bg-[#0f172a] hover:bg-[#1e293b]">
        Kaydet
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMessage.title}</DialogTitle>
            <DialogDescription>{dialogMessage.description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

