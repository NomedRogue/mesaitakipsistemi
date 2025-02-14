"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const unvanlar = ["Uzm. Diş Tabibi", "Diş Tabibi", "Veri Giriş Personeli", "Klinik Destek Personeli"]
const klinikler = [
  // Zemin Kat
  "001",
  "002",
  "003",
  "004",
  "005",
  "006",
  "007",
  "008",
  "009",
  "010",
  "011",
  "012",
  "013",
  // 1. Kat
  "101",
  "102",
  "103",
  "104",
  "105",
  "106",
  "107",
  "108",
  "109",
  "110",
  "111",
  "112",
  "113",
  "114",
  "115",
  "116",
  "117",
  // 2. Kat
  "201",
  "202",
  "203",
  "204",
  "205",
  "206",
  "207",
  "208",
  "209",
  "210",
  "211",
  "212",
  "213",
  "214",
  "215",
  "216",
  // 3. Kat
  "301",
  "302",
  "303",
  "304",
  "305",
  "306",
  "307",
  "308",
  "309",
  "310",
  "311",
  "312",
  "313",
  "314",
  "315",
  "316",
  "317",
  "318",
  "319",
  "320",
  // 6. Kat
  "601",
  "602",
  "603",
  // Diğer
  "Yok",
]
const departmanlar = ["İdari Hizmetler", "Tıbbi Hizmetler"]

interface PersonelFormData {
  tc: string
  ad: string
  soyad: string
  unvan: string
  klinik: string
  departman: string
  mesaiTamamlama: boolean
  mesaiDisiCalisir: boolean
}

interface PersonelFormProps {
  onSubmit: (data: PersonelFormData) => void
  initialData?: PersonelFormData | null
}

export function PersonelForm({ onSubmit, initialData }: PersonelFormProps) {
  const [formData, setFormData] = useState<PersonelFormData>(() => {
    return (
      initialData || {
        tc: "",
        ad: "",
        soyad: "",
        unvan: "",
        klinik: "",
        departman: "",
        mesaiTamamlama: false,
        mesaiDisiCalisir: false,
      }
    )
  })

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      setFormErrors({})
    } else {
      setFormData({
        tc: "",
        ad: "",
        soyad: "",
        unvan: "",
        klinik: "",
        departman: "",
        mesaiTamamlama: false,
        mesaiDisiCalisir: false,
      })
      setFormErrors({})
    }
  }, [initialData])

  const validateForm = (data: PersonelFormData): boolean => {
    const errors: { [key: string]: string } = {}

    if (!data.tc || data.tc.length !== 11 || !/^\d+$/.test(data.tc)) {
      errors.tc = "TC Kimlik No 11 haneli sayı olmalıdır"
    }
    if (!data.ad || data.ad.trim().length === 0) {
      errors.ad = "Ad alanı zorunludur"
    }
    if (!data.soyad || data.soyad.trim().length === 0) {
      errors.soyad = "Soyad alanı zorunludur"
    }
    if (!data.departman) {
      errors.departman = "Departman seçimi zorunludur"
    }
    if (!data.unvan) {
      errors.unvan = "Unvan seçimi zorunludur"
    }
    if (!data.klinik) {
      errors.klinik = "Klinik seçimi zorunludur"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm(formData)) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="tc">T.C. Kimlik No</Label>
          <Input
            id="tc"
            name="tc"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={11}
            value={formData.tc}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "")
              handleInputChange({ ...e, target: { ...e.target, name: "tc", value } })
            }}
            className={formErrors.tc ? "border-red-500" : ""}
          />
          {formErrors.tc && <p className="text-sm text-red-500">{formErrors.tc}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="ad">Ad</Label>
          <Input
            id="ad"
            name="ad"
            value={formData.ad}
            onChange={handleInputChange}
            className={formErrors.ad ? "border-red-500" : ""}
          />
          {formErrors.ad && <p className="text-sm text-red-500">{formErrors.ad}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="soyad">Soyad</Label>
          <Input
            id="soyad"
            name="soyad"
            value={formData.soyad}
            onChange={handleInputChange}
            className={formErrors.soyad ? "border-red-500" : ""}
          />
          {formErrors.soyad && <p className="text-sm text-red-500">{formErrors.soyad}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="departman">Departman</Label>
          <Select value={formData.departman} onValueChange={(value) => handleSelectChange("departman", value)}>
            <SelectTrigger className={formErrors.departman ? "border-red-500" : ""}>
              <SelectValue placeholder="Departman seçin" />
            </SelectTrigger>
            <SelectContent>
              {departmanlar.map((departman) => (
                <SelectItem key={departman} value={departman}>
                  {departman}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.departman && <p className="text-sm text-red-500">{formErrors.departman}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="unvan">Unvan</Label>
          <Select value={formData.unvan} onValueChange={(value) => handleSelectChange("unvan", value)}>
            <SelectTrigger className={formErrors.unvan ? "border-red-500" : ""}>
              <SelectValue placeholder="Unvan seçin" />
            </SelectTrigger>
            <SelectContent>
              {unvanlar.map((unvan) => (
                <SelectItem key={unvan} value={unvan}>
                  {unvan}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.unvan && <p className="text-sm text-red-500">{formErrors.unvan}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="klinik">Klinik</Label>
          <Select value={formData.klinik} onValueChange={(value) => handleSelectChange("klinik", value)}>
            <SelectTrigger className={formErrors.klinik ? "border-red-500" : ""}>
              <SelectValue placeholder="Klinik seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Zemin Kat</SelectLabel>
                {klinikler
                  .filter((k) => k.startsWith("0"))
                  .map((klinik) => (
                    <SelectItem key={klinik} value={klinik}>
                      {klinik}
                    </SelectItem>
                  ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>1. Kat</SelectLabel>
                {klinikler
                  .filter((k) => k.startsWith("1"))
                  .map((klinik) => (
                    <SelectItem key={klinik} value={klinik}>
                      {klinik}
                    </SelectItem>
                  ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>2. Kat</SelectLabel>
                {klinikler
                  .filter((k) => k.startsWith("2"))
                  .map((klinik) => (
                    <SelectItem key={klinik} value={klinik}>
                      {klinik}
                    </SelectItem>
                  ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>3. Kat</SelectLabel>
                {klinikler
                  .filter((k) => k.startsWith("3"))
                  .map((klinik) => (
                    <SelectItem key={klinik} value={klinik}>
                      {klinik}
                    </SelectItem>
                  ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>6. Kat</SelectLabel>
                {klinikler
                  .filter((k) => k.startsWith("6"))
                  .map((klinik) => (
                    <SelectItem key={klinik} value={klinik}>
                      {klinik}
                    </SelectItem>
                  ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Diğer</SelectLabel>
                <SelectItem value="Yok">Yok</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {formErrors.klinik && <p className="text-sm text-red-500">{formErrors.klinik}</p>}
        </div>

        {(formData.unvan === "Klinik Destek Personeli" || formData.unvan === "Veri Giriş Personeli") && (
          <div className="flex items-center space-x-2">
            <Switch
              id="mesaiTamamlama"
              checked={formData.mesaiTamamlama}
              onCheckedChange={(checked) => handleSwitchChange("mesaiTamamlama", checked)}
            />
            <Label htmlFor="mesaiTamamlama">Mesai Tamamlama</Label>
          </div>
        )}

        {(formData.unvan === "Diş Tabibi" || formData.unvan === "Uzm. Diş Tabibi") && (
          <div className="flex items-center space-x-2">
            <Switch
              id="mesaiDisiCalisir"
              checked={formData.mesaiDisiCalisir}
              onCheckedChange={(checked) => handleSwitchChange("mesaiDisiCalisir", checked)}
            />
            <Label htmlFor="mesaiDisiCalisir">Mesai Dışı Çalışır</Label>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Button type="submit" className="w-32">
            {initialData ? "Güncelle" : "Kaydet"}
          </Button>
        </div>
      </div>
    </form>
  )
}

