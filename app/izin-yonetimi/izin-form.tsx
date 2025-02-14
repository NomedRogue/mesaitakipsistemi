"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type React from "react"

interface IzinFormProps {
  onSubmit: (data: any) => void
  initialData?: {
    izinTuru?: string
    baslangicTarihi?: string
    bitisTarihi?: string
  } | null
  personelAd: string
  personelSoyad: string
}

const izinTurleri = [
  "Yıllık İzin",
  "Mazeret İzni",
  "Hastalık İzni",
  "Ücretsiz İzin",
  "Doğum İzni",
  "Babalık İzni",
  "Evlilik İzni",
  "Ölüm İzni",
]

export function IzinForm({ onSubmit, initialData = null, personelAd, personelSoyad }: IzinFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      izinTuru: formData.get("izinTuru"),
      baslangicTarihi: formData.get("baslangicTarihi"),
      bitisTarihi: formData.get("bitisTarihi"),
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label>Personel</Label>
        <Input value={`${personelAd} ${personelSoyad}`} disabled />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="izinTuru">İzin Türü</Label>
        <Select name="izinTuru" defaultValue={initialData?.izinTuru || ""}>
          <SelectTrigger>
            <SelectValue placeholder="İzin türü seçin" />
          </SelectTrigger>
          <SelectContent>
            {izinTurleri.map((tur) => (
              <SelectItem key={tur} value={tur}>
                {tur}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="baslangicTarihi">Başlangıç Tarihi</Label>
        <Input
          id="baslangicTarihi"
          name="baslangicTarihi"
          type="date"
          defaultValue={initialData?.baslangicTarihi || ""}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="bitisTarihi">Bitiş Tarihi</Label>
        <Input id="bitisTarihi" name="bitisTarihi" type="date" defaultValue={initialData?.bitisTarihi || ""} required />
      </div>

      <div className="mt-6 flex justify-center">
        <Button type="submit" className="w-32">
          {initialData ? "Güncelle" : "Kaydet"}
        </Button>
      </div>
    </form>
  )
}

