# PirosmaniArt 🎨

ბავშვების ნახატების მაღაზია — კალათა + WhatsApp შეკვეთა + Sveltia CMS ადმინ-პანელი.

## სტრუქტურა

```
index.html              — საიტი (ნახატებს კითხულობს content/products.json-დან)
admin/index.html        — ადმინ-პანელი (მისამართი: /admin)
admin/config.yml        — CMS კონფიგი
content/products.json   — ნახატების მონაცემები (CMS არედაქტირებს)
images/uploads/         — ატვირთული ფოტოები
```

## ადმინ-პანელის გამოყენება

1. გახსენი `https://შენი-საიტი.vercel.app/admin`
2. შედი GitHub-ით
3. „ნახატები → ნახატების კატალოგი“ → დაამატე/შეცვალე/წაშალე ნახატი (ფოტო, სახელი, ფასი, ზომა, ტექნიკა)
4. „Publish“ → CMS commit-ს აკეთებს GitHub-ზე → Vercel ანახლებს საიტს ~30 წამში.

## დაყენების ნაბიჯები (ერთჯერადი)

იხილე ქვემოთ — GitHub, Vercel, GitHub OAuth App და Cloudflare auth worker.
`admin/config.yml`-ში შესაცვლელია:
- `repo: USERNAME/REPO` — შენი GitHub repo
- `base_url:` — Cloudflare auth worker-ის მისამართი
