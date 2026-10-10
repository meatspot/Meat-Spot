# MEAT SPOT
موقع Next.js للمحل بأربع لغات: الهولندية والعربية والإنجليزية والتركية، مع صور المحل والتشكيلة وطاولة تفاعلية وسلة وطلبات استلام ولوحة إدارة ودخول Google.
الاسم المعتمد Fuozi Abu Alfoz، والشعار الأصلي محفوظ كما ورد.

## الحالة الفعلية
الشيفرة في https://github.com/meatspot/Meat-Spot. أُعدّ مشروع Supabase Meat Spot وطبقت المخططات الخمس. نُشر الموقع على Vercel بحالة READY:
https://meat-spot.vercel.app/nl
الدومين meat-spot.nl مضاف إلى المشروع، لكن DNS في TransIP ما زال يحتاج التعديل. اقرأ CLOUD-STATE-ar.md وDEPLOYMENT-ar.md.

التشكيلة تعرض 13 نوعاً بصورها دون أسعار مفترضة، في وضع عرض فقط. الطلبات مغلقة حتى استكمال مفاتيح الخادم وGoogle OAuth والبريد والنصوص القانونية والمواعيد والأسعار الحقيقية. ظهور Google Search وMaps لم يُتحقق منه.
الرمز البريدي المقدم 9641 MK، وسجل PDOK للعنوان يعرض 9641 MG؛ قيد التأكيد.

## التشغيل
Node.js 22 أو أحدث:
```powershell
npm ci
npm run dev
```
افتح http://localhost:3000/nl. أضف البيئة الخاصة محلياً؛ .env.example قالب فارغ، ولا تضع الأسرار في Git.

## التحقق
```powershell
npm run typecheck
npm test
npm run build
npm audit --omit=dev
```
تفاصيل الفحص وحدوده في SECURITY-VERIFICATION-ar.md. صور WebP في public/images مهيأة للتسليم السريع؛ أصول التصميم الأصلية محفوظة محلياً خارج المستودع.
