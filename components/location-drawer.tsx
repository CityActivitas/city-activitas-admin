"use client"

import * as React from "react"
import { X, Search, MapPin } from 'lucide-react'
import { GoogleMap, MarkerF } from "@react-google-maps/api"
import { useGoogleMaps } from "./providers/google-maps-provider"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const mapContainerStyle = {
  width: "100%",
  height: "100%"
}

const defaultCenter = {
  lat: 22.9997281,
  lng: 120.2270277
}

interface LocationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (address: string, coordinates: string) => void
  initialAddress?: string
  initialCoordinates?: string
}

export function LocationDrawerComponent({ 
  open, 
  onOpenChange, 
  onConfirm,
  initialAddress = "",
  initialCoordinates = ""
}: LocationDrawerProps) {
  const { isLoaded, loadError } = useGoogleMaps()
  const [map, setMap] = React.useState<google.maps.Map | null>(null)
  const [searchValue, setSearchValue] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [coordinates, setCoordinates] = React.useState("")
  const [marker, setMarker] = React.useState<google.maps.LatLngLiteral | null>(null)
  const [isLinked, setIsLinked] = React.useState(true)

  React.useEffect(() => {
    if (open) {
      setAddress(initialAddress)
      setCoordinates(initialCoordinates)
      
      if (initialCoordinates) {
        const [lat, lng] = initialCoordinates.split(',').map(Number)
        if (!isNaN(lat) && !isNaN(lng)) {
          setMarker({ lat, lng })
          map?.panTo({ lat, lng })
        }
      } else if (initialAddress && isLoaded) {
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({
          address: initialAddress,
          language: 'zh-TW'
        }).then(response => {
          if (response.results && response.results.length > 0) {
            const location = response.results[0].geometry.location
            const latLng = {
              lat: location.lat(),
              lng: location.lng()
            }
            setMarker(latLng)
            map?.panTo(latLng)
            if (isLinked) {
              setCoordinates(`${latLng.lat.toFixed(6)}, ${latLng.lng.toFixed(6)}`)
            }
          }
        }).catch(error => {
          console.error('Geocoding error:', error)
        })
      }
    }
  }, [open, initialAddress, initialCoordinates, map, isLoaded, isLinked])

  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return

    const latLng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }
    setMarker(latLng)

    try {
      const geocoder = new window.google.maps.Geocoder()
      const response = await geocoder.geocode({ 
        location: latLng,
        language: 'zh-TW'
      })

      if (response.results[0]) {
        setAddress(response.results[0].formatted_address)
        setCoordinates(`${latLng.lat.toFixed(6)}, ${latLng.lng.toFixed(6)}`)
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchValue.trim()) return

    try {
      const geocoder = new window.google.maps.Geocoder()
      const response = await geocoder.geocode({ 
        address: searchValue,
        language: 'zh-TW'
      })

      if (response.results && response.results.length > 0) {
        const location = response.results[0].geometry.location
        const latLng = {
          lat: location.lat(),
          lng: location.lng()
        }

        map?.panTo(location)
        setMarker(latLng)
        setAddress(response.results[0].formatted_address)
        setCoordinates(`${latLng.lat.toFixed(6)}, ${latLng.lng.toFixed(6)}`)
      }
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  const handleClear = () => {
    setSearchValue("")
    setMarker(null)
    setAddress("")
    setCoordinates("")
  }

  const handleConfirm = () => {
    onConfirm(address, coordinates)
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle>地址查詢</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="輸入地址或是座標來搜尋"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="outline" onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              搜尋
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <X className="h-4 w-4 mr-2" />
              清除
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="link"
              checked={isLinked}
              onCheckedChange={(checked) => setIsLinked(checked as boolean)}
            />
            <Label htmlFor="link">地址和座標連動</Label>
          </div>

          <div className="h-[40vh] w-full border rounded-md overflow-hidden">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={marker || defaultCenter}
                zoom={13}
                onLoad={setMap}
                onClick={handleMapClick}
              >
                {marker && <MarkerF position={marker} />}
              </GoogleMap>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-muted">
                載入地圖中...
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">地址:</Label>
              <div className="flex gap-2">
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  readOnly
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    if (marker) {
                      map?.panTo(marker)
                    }
                  }}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coordinates">定位:</Label>
              <Input
                id="coordinates"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                readOnly
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-8 mb-4">
            <DrawerClose asChild>
              <Button variant="outline">取消</Button>
            </DrawerClose>
            <Button onClick={handleConfirm}>確定修改</Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}