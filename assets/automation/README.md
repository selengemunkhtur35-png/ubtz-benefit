# Автомат оруулах заавар

Энэ хавтасны `product-inbox.json` файлд шинэ барааны хүсэлт нэмэхэд 2 автомат шат дараатай ажиллана:

1. `style` шат: зураг хайж татна, студи загварын poster үүсгэнэ.
2. `publish` шат: poster-ийг сайт дээрх тохирох хэсгүүдэд нэмнэ.

## `product-inbox.json` жишээ

```json
{
  "items": [
    {
      "id": "ubtz-20260428-001",
      "name": "APU Vita ус 1л 6ш",
      "partner": "APU",
      "price": 24800,
      "discount_price": 21900,
      "discount_percent": 12,
      "mainCategory": "food",
      "subcategory": "water",
      "type": "all",
      "description": "Өдөр тутмын цэвэр усны багц.",
      "badge": "Шинэ",
      "search": "APU Vita bottled water",
      "imageUrl": "",
      "addToStory": true,
      "addToDiscount": true,
      "addToFeatured": true,
      "featuredSection": "promo",
      "status": "new"
    }
  ]
}
```

## Статусын утга

- `new`: шинээр орсон, боловсруулаагүй
- `styled`: зураг/poster бэлэн, нийтлэхэд бэлэн
- `published`: сайт руу амжилттай нэмэгдсэн
- `error`: алдаа гарсан (message талбарт тайлбар үлдэнэ)

## Тэмдэглэл

- `imageUrl` хоосон бол `search` (эсвэл `name`) ашиглаж вэбээс зураг хайна.
- `mainCategory` зөвшөөрөгдөх утгууд:
  - `all`, `food`, `home`, `electronics`, `health`, `education`, `service`
- `featuredSection`:
  - `promo` эсвэл `launch`
