export const locales = ['nl','ar','en','tr'] as const;
export type Locale = typeof locales[number];
export const validLocale = (s:string):s is Locale => (locales as readonly string[]).includes(s);
export const messages: Record<string, readonly string[]> = {
  "preview": [
    "Ontwerpvoorstel · geen echte bestellingen",
    "معاينة تصميم · لا توجد طلبات حقيقية",
    "Design preview · no real orders",
    "Tasarım önizlemesi · gerçek sipariş oluşturulmaz"
  ],
  "screen": [
    "Scherm",
    "الشاشة",
    "Screen",
    "Ekran"
  ],
  "home": [
    "Home",
    "الرئيسية",
    "Home",
    "Ana sayfa"
  ],
  "catalog": [
    "Assortiment",
    "المنتجات",
    "Products",
    "Ürünler"
  ],
  "product": [
    "Product",
    "المنتج",
    "Product",
    "Ürün"
  ],
  "cart": [
    "Winkelmand",
    "السلة",
    "Basket",
    "Sepet"
  ],
  "checkout": [
    "Ophalen plannen",
    "موعد الاستلام",
    "Plan pickup",
    "Teslim alma"
  ],
  "account": [
    "Mijn account",
    "حسابي",
    "My account",
    "Hesabım"
  ],
  "admin": [
    "Beheer",
    "الإدارة",
    "Admin",
    "Yönetim"
  ],
  "contact": [
    "Contact",
    "التواصل",
    "Contact",
    "İletişim"
  ],
  "heroLabel": [
    "MEAT SPOT · VEENDAM",
    "MEAT SPOT · فيندام",
    "MEAT SPOT · VEENDAM",
    "MEAT SPOT · VEENDAM"
  ],
  "heroTitle": [
    "Jouw slager.<br>Jouw keuze.",
    "جزارتك.<br>على ذوقك.",
    "Your butcher.<br>Your choice.",
    "Kasabınız.<br>Sizin seçiminiz."
  ],
  "heroText": [
    "Bekijk ons assortiment en plan je afhaling bij onze slagerij aan het Veenlustplein.",
    "تصفح المنتجات وحدد موعد استلام طلبك من محلنا في ساحة Veenlustplein.",
    "Explore our selection and plan pickup from our shop at Veenlustplein.",
    "Ürünlerimizi keşfedin ve Veenlustplein mağazamızdan teslim alma zamanınızı seçin."
  ],
  "browse": [
    "Bekijk assortiment",
    "تصفح المنتجات",
    "Explore products",
    "Ürünleri keşfet"
  ],
  "hoursShort": [
    "Ma–za 10:00–18:00 · zondag gesloten",
    "الاثنين–السبت 10:00–18:00 · الأحد مغلق",
    "Mon–Sat 10:00–18:00 · closed Sunday",
    "Pzt–Cmt 10:00–18:00 · Pazar kapalı"
  ],
  "pickupTitle": [
    "Ophalen in Veendam",
    "الاستلام من فيندام",
    "Collect in Veendam",
    "Veendam’dan teslim alın"
  ],
  "pickupText": [
    "Veenlustplein 11",
    "Veenlustplein 11",
    "Veenlustplein 11",
    "Veenlustplein 11"
  ],
  "payTitle": [
    "Betalen in de winkel",
    "الدفع في المحل",
    "Pay in store",
    "Mağazada ödeme"
  ],
  "payText": [
    "Na het plaatsen van je bestelling",
    "بعد تقديم طلبك",
    "After placing your order",
    "Siparişinizi verdikten sonra"
  ],
  "googleTitle": [
    "Inloggen met Google",
    "الدخول عبر Google",
    "Sign in with Google",
    "Google ile giriş"
  ],
  "googleText": [
    "Voor een veilige bestelling",
    "لإتمام الطلب بأمان",
    "To place your order securely",
    "Güvenli sipariş için"
  ],
  "selection": [
    "Ontdek onze selectie",
    "اكتشف تشكيلتنا",
    "Explore our selection",
    "Ürün seçkimiz"
  ],
  "all": [
    "Alles",
    "الكل",
    "All",
    "Tümü"
  ],
  "meat": [
    "Vlees",
    "اللحوم",
    "Meat",
    "Et"
  ],
  "chicken": [
    "Kip",
    "الدجاج",
    "Chicken",
    "Tavuk"
  ],
  "beef": [
    "Rundvlees",
    "اللحم البقري",
    "Beef",
    "Dana eti"
  ],
  "lamb": [
    "Lamsvlees",
    "لحم الضأن",
    "Lamb",
    "Kuzu eti"
  ],
  "fish": [
    "Vis",
    "السمك",
    "Fish",
    "Balık"
  ],
  "spices": [
    "Kruiden & Specerijen",
    "التوابل والبهارات",
    "Herbs & Spices",
    "Baharatlar"
  ],
  "fillet": [
    "Kipfilet",
    "فيليه الدجاج",
    "Chicken fillet",
    "Tavuk fileto"
  ],
  "bone": [
    "Vlees met bot",
    "لحم بالعظم",
    "Bone-in meat",
    "Kemikli et"
  ],
  "skewers": [
    "Spiesjes",
    "أسياخ متبّلة",
    "Marinated skewers",
    "Marine edilmiş şiş"
  ],
  "wings": [
    "Kippenvleugels",
    "أجنحة الدجاج",
    "Chicken wings",
    "Tavuk kanadı"
  ],
  "ribs": [
    "Ribstukken",
    "قطع أضلاع",
    "Rib pieces",
    "Kaburga parçaları"
  ],
  "price": [
    "Prijs volgt",
    "السعر يُحدّد لاحقًا",
    "Price to be confirmed",
    "Fiyat yakında"
  ],
  "view": [
    "Bekijken",
    "عرض المنتج",
    "View product",
    "Ürünü gör"
  ],
  "catalogText": [
    "Kies een categorie en ontdek de producten. Prijzen en beschikbaarheid worden door de winkel ingesteld.",
    "اختر القسم وتصفح المنتجات. يحدد المحل الأسعار والتوفر قبل فتح الطلبات.",
    "Choose a category and explore products. The shop will set prices and availability before ordering opens.",
    "Kategori seçip ürünleri keşfedin. Fiyat ve stoklar siparişe açılmadan önce mağaza tarafından belirlenecek."
  ],
  "search": [
    "Zoek een product…",
    "ابحث عن منتج…",
    "Search products…",
    "Ürün ara…"
  ],
  "emptyCatalog": [
    "Producten worden toegevoegd zodra het assortiment is bevestigd.",
    "ستُضاف المنتجات عند تأكيد التشكيلة.",
    "Products will be added when the catalogue is confirmed.",
    "Ürünler onaylandığında eklenecek."
  ],
  "photoNote": [
    "Productbeeld op basis van onze winkelbeelden.",
    "صورة معالجة اعتمادًا على صور المحل.",
    "Product image edited from our shop photographs.",
    "Mağaza fotoğraflarımızdan düzenlenmiş ürün görseli."
  ],
  "detailText": [
    "Bekijk het product en kies straks de gewenste hoeveelheid. De winkel bevestigt productinformatie, prijs en beschikbaarheid vóór opening van de online bestellingen.",
    "اطلع على المنتج، ثم اختر الكمية المطلوبة عند فتح الطلبات. يؤكد المحل معلومات المنتج والسعر والتوفر قبل إتاحة الطلب.",
    "Explore the product and choose your quantity once ordering opens. Product details, pricing and availability will be confirmed by the shop.",
    "Siparişler açıldığında ürünü inceleyip miktarı seçin. Ürün bilgisi, fiyat ve stok mağaza tarafından onaylanacak."
  ],
  "unitPending": [
    "Verkoopeenheid wordt bevestigd",
    "وحدة البيع تحتاج التأكيد",
    "Sales unit to be confirmed",
    "Satış birimi onaylanacak"
  ],
  "unpriced": [
    "Nog niet te bestellen",
    "غير متاح للطلب بعد",
    "Ordering not open yet",
    "Henüz siparişe açık değil"
  ],
  "backCatalog": [
    "Terug naar assortiment",
    "العودة للمنتجات",
    "Back to products",
    "Ürünlere dön"
  ],
  "exampleSelection": [
    "Voorbeeldselectie: 500 gram",
    "اختيار توضيحي: 500 غرام",
    "Example selection: 500 grams",
    "Örnek miktar: 500 gram"
  ],
  "cartIntro": [
    "Zo ziet een bestelling eruit voordat je een ophaalmoment kiest.",
    "هكذا سيظهر الطلب قبل اختيار موعد الاستلام.",
    "This is how an order will look before you choose pickup.",
    "Teslim alma zamanı seçmeden önce siparişiniz böyle görünecek."
  ],
  "overview": [
    "Overzicht",
    "الملخص",
    "Summary",
    "Özet"
  ],
  "subtotal": [
    "Producten",
    "المنتجات",
    "Products",
    "Ürünler"
  ],
  "total": [
    "Totaal",
    "الإجمالي",
    "Total",
    "Toplam"
  ],
  "pending": [
    "Nog niet vastgesteld",
    "لم يُحدّد بعد",
    "Not set yet",
    "Henüz belirlenmedi"
  ],
  "priceGate": [
    "Bestellen wordt beschikbaar zodra de winkel de prijzen heeft ingesteld.",
    "يصبح الطلب متاحًا بعد إدخال المحل للأسعار.",
    "Ordering will open once the shop has set prices.",
    "Mağaza fiyatları belirlediğinde siparişler açılacak."
  ],
  "pickupOnly": [
    "Alleen ophalen · betalen in de winkel",
    "استلام فقط · الدفع في المحل",
    "Pickup only · pay in store",
    "Yalnızca mağazadan teslim · mağazada ödeme"
  ],
  "stepSign": [
    "1 · Inloggen",
    "1 · تسجيل الدخول",
    "1 · Sign in",
    "1 · Giriş"
  ],
  "stepSlot": [
    "2 · Ophaalmoment",
    "2 · موعد الاستلام",
    "2 · Pickup time",
    "2 · Teslim alma"
  ],
  "stepReview": [
    "3 · Controleren",
    "3 · المراجعة",
    "3 · Review",
    "3 · Kontrol"
  ],
  "signinText": [
    "Gebruik je Google-account om af te rekenen en je bestellingen terug te vinden.",
    "استخدم حساب Google لإتمام الطلب وعرض طلباتك السابقة.",
    "Use your Google account to check out and view past orders.",
    "Siparişi tamamlamak ve geçmiş siparişleri görmek için Google hesabınızı kullanın."
  ],
  "date": [
    "Ophaaldatum",
    "تاريخ الاستلام",
    "Pickup date",
    "Teslim alma tarihi"
  ],
  "chooseDate": [
    "Kies een datum",
    "اختر التاريخ",
    "Choose a date",
    "Tarih seçin"
  ],
  "time": [
    "Ophaaltijd",
    "وقت الاستلام",
    "Pickup time",
    "Teslim alma saati"
  ],
  "chooseTime": [
    "Beschikbare tijden verschijnen hier",
    "ستظهر المواعيد المتاحة هنا",
    "Available times will appear here",
    "Uygun saatler burada görünecek"
  ],
  "placeOrder": [
    "Bestelling plaatsen",
    "تأكيد الطلب",
    "Place order",
    "Sipariş ver"
  ],
  "confirmation": [
    "Na bevestiging ontvang je een bestelnummer.",
    "بعد التأكيد ستحصل على رقم الطلب.",
    "After confirmation you will receive an order number.",
    "Onaydan sonra sipariş numarası alacaksınız."
  ],
  "orderHistory": [
    "Mijn bestellingen",
    "طلباتي",
    "My orders",
    "Siparişlerim"
  ],
  "noOrders": [
    "Nog geen bestellingen",
    "لا توجد طلبات بعد",
    "No orders yet",
    "Henüz sipariş yok"
  ],
  "accountText": [
    "Je profiel en bestellingen verschijnen hier na het inloggen.",
    "يظهر ملفك وطلباتك هنا بعد الدخول.",
    "Your profile and orders will appear here after signing in.",
    "Giriş yaptıktan sonra profiliniz ve siparişleriniz burada görünecek."
  ],
  "products": [
    "Producten",
    "المنتجات",
    "Products",
    "Ürünler"
  ],
  "orders": [
    "Bestellingen",
    "الطلبات",
    "Orders",
    "Siparişler"
  ],
  "settings": [
    "Winkelinstellingen",
    "إعدادات المحل",
    "Store settings",
    "Mağaza ayarları"
  ],
  "adminTitle": [
    "Winkelbeheer",
    "إدارة المحل",
    "Store management",
    "Mağaza yönetimi"
  ],
  "adminText": [
    "Een centrale plek voor producten, prijzen en ophaalbestellingen.",
    "مكان واحد لإدارة المنتجات والأسعار وطلبات الاستلام.",
    "One place for products, prices and pickup orders.",
    "Ürünler, fiyatlar ve teslim alma siparişleri tek yerde."
  ],
  "newOrders": [
    "Nieuwe bestellingen",
    "طلبات جديدة",
    "New orders",
    "Yeni siparişler"
  ],
  "readyOrders": [
    "Klaar voor ophalen",
    "جاهزة للاستلام",
    "Ready for pickup",
    "Teslim almaya hazır"
  ],
  "activeProducts": [
    "Actieve producten",
    "منتجات مفعلة",
    "Active products",
    "Aktif ürünler"
  ],
  "name": [
    "Naam",
    "الاسم",
    "Name",
    "Ad"
  ],
  "category": [
    "Categorie",
    "القسم",
    "Category",
    "Kategori"
  ],
  "availability": [
    "Beschikbaarheid",
    "التوفر",
    "Availability",
    "Stok durumu"
  ],
  "draft": [
    "Concept",
    "مسودة",
    "Draft",
    "Taslak"
  ],
  "edit": [
    "Bewerken",
    "تعديل",
    "Edit",
    "Düzenle"
  ],
  "newProduct": [
    "Product toevoegen",
    "إضافة منتج",
    "Add product",
    "Ürün ekle"
  ],
  "save": [
    "Opslaan",
    "حفظ",
    "Save",
    "Kaydet"
  ],
  "editor": [
    "Product bewerken",
    "تعديل المنتج",
    "Edit product",
    "Ürün düzenle"
  ],
  "description": [
    "Beschrijving",
    "الوصف",
    "Description",
    "Açıklama"
  ],
  "unit": [
    "Verkoopeenheid",
    "وحدة البيع",
    "Sales unit",
    "Satış birimi"
  ],
  "selectUnit": [
    "Kilogram / gram / stuk / verpakking",
    "كيلوغرام / غرام / قطعة / عبوة",
    "Kilogram / gram / piece / package",
    "Kilogram / gram / adet / paket"
  ],
  "images": [
    "Productbeelden",
    "صور المنتج",
    "Product photos",
    "Ürün görselleri"
  ],
  "translationsLabel": [
    "Vertalingen: NL / AR / EN / TR",
    "الترجمات: NL / AR / EN / TR",
    "Translations: NL / AR / EN / TR",
    "Çeviriler: NL / AR / EN / TR"
  ],
  "orderNumber": [
    "Bestelnummer",
    "رقم الطلب",
    "Order number",
    "Sipariş numarası"
  ],
  "customer": [
    "Klant",
    "العميل",
    "Customer",
    "Müşteri"
  ],
  "status": [
    "Status",
    "الحالة",
    "Status",
    "Durum"
  ],
  "submitted": [
    "Ontvangen",
    "تم الاستلام",
    "Received",
    "Alındı"
  ],
  "confirmed": [
    "Bevestigd",
    "تم التأكيد",
    "Confirmed",
    "Onaylandı"
  ],
  "ready": [
    "Klaar",
    "جاهز",
    "Ready",
    "Hazır"
  ],
  "completed": [
    "Afgehaald",
    "تم الاستلام من المحل",
    "Collected",
    "Teslim alındı"
  ],
  "cancelled": [
    "Geannuleerd",
    "ملغى",
    "Cancelled",
    "İptal"
  ],
  "opening": [
    "Openingstijden",
    "ساعات العمل",
    "Opening hours",
    "Çalışma saatleri"
  ],
  "weekdays": [
    "Maandag–zaterdag",
    "الاثنين–السبت",
    "Monday–Saturday",
    "Pazartesi–Cumartesi"
  ],
  "sunday": [
    "Zondag",
    "الأحد",
    "Sunday",
    "Pazar"
  ],
  "closed": [
    "Gesloten",
    "مغلق",
    "Closed",
    "Kapalı"
  ],
  "slots": [
    "Ophaalmomenten",
    "مواعيد الاستلام",
    "Pickup slots",
    "Teslim alma saatleri"
  ],
  "capacity": [
    "Capaciteit en voorbereidingstijd",
    "السعة ومدة التحضير",
    "Capacity and preparation time",
    "Kapasite ve hazırlık süresi"
  ],
  "notification": [
    "Meldingen",
    "الإشعارات",
    "Notifications",
    "Bildirimler"
  ],
  "contactTitle": [
    "Kom langs in Veendam",
    "زرنا في فيندام",
    "Visit us in Veendam",
    "Veendam’da bizi ziyaret edin"
  ],
  "contactText": [
    "Je vindt MEAT SPOT aan het Veenlustplein. Neem contact op voor vragen over het assortiment.",
    "تجد MEAT SPOT في Veenlustplein. تواصل معنا للاستفسار عن المنتجات.",
    "Find MEAT SPOT at Veenlustplein. Contact us with questions about the selection.",
    "MEAT SPOT’u Veenlustplein’de bulabilirsiniz. Ürünler hakkında bilgi için iletişime geçin."
  ],
  "route": [
    "Route bekijken",
    "عرض الاتجاهات",
    "Get directions",
    "Yol tarifi"
  ],
  "privacy": [
    "Privacy",
    "الخصوصية",
    "Privacy",
    "Gizlilik"
  ],
  "terms": [
    "Voorwaarden",
    "الشروط",
    "Terms",
    "Koşullar"
  ],
  "about": [
    "Over ons",
    "عن المحل",
    "About us",
    "Hakkımızda"
  ],
  "demoTitle": [
    "Ontwerpvoorstel",
    "معاينة تصميم",
    "Design preview",
    "Tasarım önizlemesi"
  ],
  "demoBody": [
    "Deze knop laat de geplande functie zien. Google, bestellingen en gegevensopslag worden pas in de bouwfase aangesloten.",
    "هذا الزر يوضح الوظيفة المخطط لها. سيُربط Google والطلبات وحفظ البيانات في مرحلة التنفيذ.",
    "This button illustrates a planned feature. Google, orders and data storage will be connected during implementation.",
    "Bu düğme planlanan özelliği gösterir. Google, sipariş ve veri kaydı geliştirme aşamasında bağlanacak."
  ],
  "legalBody": [
    "De winkelgegevens en juridische teksten worden vóór publicatie bevestigd.",
    "تُؤكد بيانات المحل والنصوص القانونية قبل النشر.",
    "Store details and legal copy will be confirmed before publication.",
    "Mağaza bilgileri ve hukuki metinler yayınlanmadan önce onaylanacak."
  ],
  "close": [
    "Sluiten",
    "إغلاق",
    "Close",
    "Kapat"
  ],
  "catalogPending": [
    "Ons online assortiment wordt voorbereid.",
    "نعمل على تجهيز قائمة المنتجات للطلب عبر الموقع.",
    "Our online catalogue is being prepared.",
    "Çevrim içi ürün listemiz hazırlanıyor."
  ],
  "storefront": [
    "Onze winkel",
    "محلنا",
    "Our shop",
    "Mağazamız"
  ],
  "signOut": [
    "Uitloggen",
    "تسجيل الخروج",
    "Sign out",
    "Çıkış"
  ],
  "addCart": [
    "In winkelmand",
    "أضف للسلة",
    "Add to basket",
    "Sepete ekle"
  ],
  "remove": [
    "Verwijderen",
    "إزالة",
    "Remove",
    "Kaldır"
  ],
  "quantity": [
    "Hoeveelheid",
    "الكمية",
    "Quantity",
    "Miktar"
  ],
  "emptyCart": [
    "Je winkelmand is leeg.",
    "السلة فارغة.",
    "Your basket is empty.",
    "Sepetiniz boş."
  ],
  "continueCheckout": [
    "Verder naar ophalen",
    "المتابعة لاختيار الاستلام",
    "Continue to pickup",
    "Teslim almaya devam"
  ],
  "loginUnavailable": [
    "Inloggen is nog niet beschikbaar. Neem contact op met de winkel.",
    "الدخول غير متاح بعد. تواصل مع المحل.",
    "Sign-in is not available yet. Contact the shop.",
    "Giriş henüz açık değil. Mağazayla iletişime geçin."
  ],
  "checkoutUnavailable": [
    "Online bestellen is nog niet beschikbaar.",
    "الطلب عبر الموقع غير متاح بعد.",
    "Online ordering is not available yet.",
    "Çevrim içi sipariş henüz açık değil."
  ],
  "saveSuccess": [
    "Opgeslagen",
    "تم الحفظ",
    "Saved",
    "Kaydedildi"
  ],
  "error": [
    "Dat is niet gelukt. Probeer opnieuw.",
    "لم تنجح العملية. حاول مجددًا.",
    "That did not work. Try again.",
    "İşlem başarısız. Yeniden deneyin."
  ],
  "phone": [
    "Telefoonnummer",
    "رقم الهاتف",
    "Phone number",
    "Telefon numarası"
  ],
  "notes": [
    "Opmerking",
    "ملاحظة",
    "Note",
    "Not"
  ],
  "priceChanged": [
    "Prijs of beschikbaarheid is veranderd. Controleer je bestelling opnieuw.",
    "تغير السعر أو التوفر. راجع طلبك مجددًا.",
    "Price or availability changed. Review your order again.",
    "Fiyat veya stok değişti. Siparişinizi yeniden kontrol edin."
  ],
  "slotUnavailable": [
    "Dit ophaalmoment is niet meer beschikbaar.",
    "موعد الاستلام هذا لم يعد متاحًا.",
    "This pickup time is no longer available.",
    "Bu teslim alma saati artık uygun değil."
  ],
  "orderPlaced": [
    "Je bestelling is ontvangen",
    "تم استلام طلبك",
    "Your order has been received",
    "Siparişiniz alındı"
  ],
  "estimated": [
    "Geschat totaal",
    "الإجمالي التقديري",
    "Estimated total",
    "Tahmini toplam"
  ],
  "weightNote": [
    "Bij producten op gewicht kan het eindbedrag afhangen van het werkelijke gewicht.",
    "قد يتغير السعر النهائي للمنتجات بالوزن وفق الوزن الفعلي.",
    "For weighted products the final amount may depend on the actual weight.",
    "Tartılan ürünlerde son tutar gerçek ağırlığa bağlı olabilir."
  ],
  "whatsapp": [
    "Vraag over je bestelling via WhatsApp",
    "استفسر عن طلبك عبر WhatsApp",
    "Ask about your order on WhatsApp",
    "Siparişinizi WhatsApp’tan sorun"
  ],
  "noSlots": [
    "Geen ophaalmomenten beschikbaar.",
    "لا توجد مواعيد استلام متاحة.",
    "No pickup times available.",
    "Uygun teslim alma saati yok."
  ],
  "forbidden": [
    "Geen toegang",
    "غير مسموح بالدخول",
    "Access denied",
    "Erişim reddedildi"
  ],
  "legalPending": [
    "Deze informatie wordt vóór de opening van online bestellen bevestigd.",
    "ستُعتمد هذه المعلومات قبل فتح الطلب عبر الموقع.",
    "This information will be confirmed before online ordering opens.",
    "Bu bilgi çevrim içi sipariş açılmadan önce onaylanacak."
  ],
  "allCategories": [
    "Alle categorieën",
    "جميع الأقسام",
    "All categories",
    "Tüm kategoriler"
  ],
  "upload": [
    "Foto uploaden",
    "رفع صورة",
    "Upload photo",
    "Görsel yükle"
  ],
  "published": [
    "Gepubliceerd",
    "منشور",
    "Published",
    "Yayınlandı"
  ],
  "archived": [
    "Gearchiveerd",
    "مؤرشف",
    "Archived",
    "Arşivlendi"
  ],
  "unitKg": [
    "Kilogram",
    "كيلوغرام",
    "Kilogram",
    "Kilogram"
  ],
  "unitG": [
    "Gram",
    "غرام",
    "Gram",
    "Gram"
  ],
  "unitPiece": [
    "Stuk",
    "قطعة",
    "Piece",
    "Adet"
  ],
  "unitPackage": [
    "Verpakking",
    "عبوة",
    "Package",
    "Paket"
  ],
  "minQty": [
    "Minimumhoeveelheid",
    "الحد الأدنى للكمية",
    "Minimum quantity",
    "Minimum miktar"
  ],
  "stepQty": [
    "Hoeveelheidsstap",
    "خطوة الكمية",
    "Quantity increment",
    "Miktar adımı"
  ],
  "priceCents": [
    "Prijs (euro)",
    "السعر باليورو",
    "Price (euro)",
    "Fiyat (euro)"
  ],
  "manageCategories": [
    "Categorieën beheren",
    "إدارة الأقسام",
    "Manage categories",
    "Kategorileri yönet"
  ],
  "generateSlots": [
    "Ophaalmomenten aanmaken",
    "إنشاء مواعيد الاستلام",
    "Generate pickup slots",
    "Teslim alma saatleri oluştur"
  ],
  "leadMinutes": [
    "Voorbereidingstijd (minuten)",
    "مدة التحضير بالدقائق",
    "Preparation time (minutes)",
    "Hazırlık süresi (dakika)"
  ],
  "intervalMinutes": [
    "Slotduur (minuten)",
    "مدة فترة الاستلام بالدقائق",
    "Slot length (minutes)",
    "Teslim aralığı (dakika)"
  ],
  "slotCapacity": [
    "Bestellingen per slot",
    "عدد الطلبات لكل فترة",
    "Orders per slot",
    "Her aralık için sipariş sayısı"
  ],
  "finalWeight": [
    "Werkelijk gewicht (gram)",
    "الوزن الفعلي بالغرام",
    "Actual weight (grams)",
    "Gerçek ağırlık (gram)"
  ],
  "finalAmount": [
    "Eindbedrag",
    "الإجمالي النهائي",
    "Final amount",
    "Son tutar"
  ],
  "confirmOrder": [
    "Bevestigen",
    "تأكيد",
    "Confirm",
    "Onayla"
  ],
  "markReady": [
    "Klaar melden",
    "تحديد كجاهز",
    "Mark ready",
    "Hazır olarak işaretle"
  ],
  "completeOrder": [
    "Afgehaald melden",
    "تحديد كمستلم",
    "Mark collected",
    "Teslim alındı olarak işaretle"
  ],
  "cancelOrder": [
    "Annuleren",
    "إلغاء",
    "Cancel",
    "İptal"
  ],
  "offerPrice": [
    "Actieprijs (optioneel)",
    "سعر العرض (اختياري)",
    "Offer price (optional)",
    "İndirimli fiyat (isteğe bağlı)"
  ],
  "offerUntil": [
    "Actie eindigt",
    "نهاية العرض",
    "Offer ends",
    "İndirim bitişi"
  ],
  "content": [
    "Inhoud",
    "المحتوى",
    "Content",
    "İçerik"
  ],
  "aboutText": [
    "MEAT SPOT is een slagerij aan het Veenlustplein in Veendam. Je kunt bij ons terecht voor vragen over ons assortiment.",
    "MEAT SPOT محل جزارة في Veenlustplein بمدينة فيندام. تواصل معنا للاستفسار عن تشكيلتنا.",
    "MEAT SPOT is a butcher shop at Veenlustplein in Veendam. Contact us with questions about our selection.",
    "MEAT SPOT, Veendam Veenlustplein’de bulunan bir kasaptır. Ürünlerimiz hakkında sorularınız için bize ulaşın."
  ],
  "nextPage": [
    "Volgende",
    "التالي",
    "Next",
    "Sonraki"
  ],
  "previousPage": [
    "Vorige",
    "السابق",
    "Previous",
    "Önceki"
  ],
  "ordersEnabled": [
    "Online bestellen openen",
    "فتح الطلب عبر الموقع",
    "Open online ordering",
    "Çevrim içi siparişi aç"
  ],
  "savedPending": [
    "Controleer de ingestelde gegevens vóór publiceren.",
    "راجع البيانات المدخلة قبل النشر.",
    "Review the configured data before publishing.",
    "Yayınlamadan önce girilen bilgileri kontrol edin."
  ],
  "productURL": [
    "Productadres",
    "رابط المنتج",
    "Product address",
    "Ürün bağlantısı"
  ],
  "plateTitle": [
    "Kies je assortiment",
    "اختر تشكيلتك",
    "Choose your selection",
    "Ürün seçkinizi oluşturun"
  ],
  "plateText": [
    "Ontdek kip, vlees en vis aan onze tafel.",
    "استكشف الدجاج واللحوم والسمك على طاولتنا.",
    "Explore chicken, meat and fish at our table.",
    "Masamızdaki tavuk, et ve balığı keşfedin."
  ],
  "parentCategory": [
    "Hoofdcategorie",
    "القسم الرئيسي",
    "Parent category",
    "Üst kategori"
  ],
  "none": [
    "Geen",
    "لا يوجد",
    "None",
    "Yok"
  ],
  "closureDates": [
    "Gesloten datums (één per regel)",
    "تواريخ الإغلاق (واحد لكل سطر)",
    "Closed dates (one per line)",
    "Kapalı tarihler (her satırda bir)"
  ],
  "retryNotifications": [
    "Meldingen opnieuw versturen",
    "إعادة محاولة الإشعارات",
    "Retry notifications",
    "Bildirimleri yeniden dene"
  ],
  "ownerName": [
    "Eigenaar",
    "صاحب المحل",
    "Owner",
    "İşletme sahibi"
  ],
  "address": [
    "Adres",
    "العنوان",
    "Address",
    "Adres"
  ],
  "postalCode": [
    "Postcode",
    "الرمز البريدي",
    "Postal code",
    "Posta kodu"
  ],
  "city": [
    "Plaats",
    "المدينة",
    "City",
    "Şehir"
  ],
  "email": [
    "E-mail",
    "البريد الإلكتروني",
    "Email",
    "E-posta"
  ],
  "sortOrder": [
    "Volgorde",
    "الترتيب",
    "Sort order",
    "Sıralama"
  ],
  "showMap": [
    "Kaart tonen",
    "عرض الخريطة",
    "Show map",
    "Haritayı göster"
  ],
  "mapConsent": [
    "Na het openen van de kaart wordt verbinding gemaakt met Google Maps.",
    "عند فتح الخريطة يتم الاتصال بخدمة Google Maps.",
    "Opening the map connects to Google Maps.",
    "Haritayı açınca Google Maps’e bağlanılır."
  ],
  "latitude": [
    "Breedtegraad",
    "خط العرض",
    "Latitude",
    "Enlem"
  ],
  "longitude": [
    "Lengtegraad",
    "خط الطول",
    "Longitude",
    "Boylam"
  ],
  "mapPlace": [
    "Google Place ID (bevestigde locatie)",
    "معرف Google للمكان بعد تأكيده",
    "Google Place ID (verified location)",
    "Google Place ID (doğrulanmış konum)"
  ],
  "offer": [
    "Aanbieding",
    "عرض",
    "Offer",
    "İndirim"
  ]
};
messages.showcase = ["Alleen tonen","عرض التشكيلة فقط","Display only","Yalnızca göster"];
export function translator(locale:Locale){const index=locales.indexOf(locale);return (key:string)=>messages[key]?.[index]??key;}
export function money(cents:number,locale:Locale){return new Intl.NumberFormat(locale==='ar'?'ar-NL':locale,{style:'currency',currency:'EUR'}).format(cents/100);}
