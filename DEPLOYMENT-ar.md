# الربط والنشر
لم يُنفّذ نشر أو تغيير DNS أو تعديل مشاريع سحابية حتى الآن. الأدوات المتصلة تعرض حساب GitHub AAKWHX وSupabase blue-sass، وليسا هدف MEAT SPOT المؤكد. تسجيل الدخول في صفحات المتصفح لا يبدّل حسابات الموصلات تلقائياً.

## ترتيب التنفيذ
1. تأكيد مستودع GitHub ومشروع Supabase وفريق Vercel ومشروع Google Cloud الصحيح. إعادة توصيل الأدوات بالحساب الذي يملكها أو إصلاح التحكم بالمتصفح. لا تستخدم blue-sass ولا تنشئ مشروعاً في فريق غير مؤكد.
2. رفع هذا المجلد كجذر مستودع الموقع، أو تحديد website كـ Root Directory إذا كان داخل مستودع أكبر. تأكد أن .env.local وnode_modules و.next لا تدخل Git.
3. ربط Supabase CLI بالمرجع الصحيح ثم تطبيق migrations الثلاث. قراءة المخطط الحالي أولاً إذا المشروع ليس فارغاً؛ لا تنفذ reset على قاعدة حقيقية.
4. إضافة مفاتيح الخادم والواجهة وفق الجدول أدناه. تشغيل سكربت المسودات مرة واحدة بعد ضبط MEAT_SPOT_PROJECT_REF والتحقق من هوية المشروع. السكربت يمنع مرجع blue-sass القديم.
5. إعداد Google OAuth في Google Cloud ووضع client ID وclient secret في مزوّد Google داخل Supabase Auth. رابط الرجوع إلى Google يكون https://PROJECT_REF.supabase.co/auth/v1/callback. إعداد Supabase Site URL وRedirect URLs لعناوين الموقع /auth/callback؛ تستخدم الشيفرة callback واحداً.
6. ربط المستودع بـ Vercel وضبط المتغيرات للإنتاج والمعاينة كلٌ بقيمه. التحقق من Google login وحساب الإدارة ثم المنتجات والأسعار القانونية ومواعيد الاستلام والطلبات ورسائل البريد على المعاينة.
7. إضافة meat-spot.nl وwww.meat-spot.nl للمشروع الصحيح. استخدم سجلات DNS التي يعرضها Vercel لهذا المشروع في TransIP؛ حافظ على MX وTXT للبريد. بعد نجاح SSL والتحقق من الدومين، اضبط APP_URL=https://meat-spot.nl وأعد النشر.
8. فحص النشر الفعلي على الهاتف والكمبيوتر، محاولة وصول غير مصرح للإدارة، طلب تجريبي متفق عليه، رسالة البريد، sitemap وrobots والروابط والصور.

## المفاتيح
| المتغير | مكان الاستخدام |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | عنوان المشروع الصحيح؛ معلومة عامة |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | مفتاح واجهة عام؛ الأمان بواسطة RLS |
| SUPABASE_SECRET_KEY | خادم فقط؛ لا بادئة NEXT_PUBLIC ولا Git |
| OWNER_ADMIN_EMAIL | خادم/إعداد فقط؛ البريد المعتمد موجود في .env.local |
| APP_URL | عنوان النشر الدقيق لفحص Origin والروابط |
| RESEND_API_KEY | خادم فقط؛ يحتاج حساب Resend ودومين إرسال متحقق |
| EMAIL_FROM | عنوان إرسال من الدومين المتحقق |
| BUSINESS_NOTIFICATION_EMAIL | بريد استقبال المحل بعد تأكيد ملكيته |
| CRON_SECRET | قيمة عشوائية قوية للخادم ومعالج outbox |
| NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY | مفتاح عام مقيد بـ Maps Embed API وHTTP referrers للموقع |
| GOOGLE_SITE_VERIFICATION | رمز تحقق Search Console؛ ليس سراً |
| MEAT_SPOT_PROJECT_REF | تحقق هوية لسكربت المسودات فقط |

لا تُرسل الأسرار في المحادثة. ضعها مباشرة في البيئة الخاصة أو إعدادات الخدمة. تجنب تضمين قيمها في السجلات أو لقطات الشاشة.
Google client secret يُحفظ في إعداد Google داخل Supabase ولا يحتاجه المتصفح.

## Google Search وMaps
الموقع يجهز sitemap وrobots وLocalBusiness. يجب تأكيد الرمز البريدي والإحداثيات وPlace ID الخاص بالمحل قبل إدخالهما من الإدارة.
تحقق من ملكية الدومين في Search Console ثم أرسل sitemap.xml واطلب الفهرسة.
Google Business Profile يحتاج ملف المحل الصحيح والتحقق الذي تحدده Google؛ لا تعدل ملف نشاط سابق في العنوان نفسه. أضف الصور الحقيقية وساعات العمل والمنتجات والرابط بعد التحقق.
إدراج بيانات منظمة أو نشر الموقع لا يضمن موعد الظهور في Google ولا ترتيب البحث.

## تشغيل المسودات
بعد تطبيق المخطط وإضافة البيئة الخاصة الصحيحة:
```powershell
node --env-file=.env.local --import tsx scripts/seed-drafts.ts
```
المسودات غير متاحة للبيع. راجع أنواع المنتجات ووحداتها وكمياتها وصورها وأسعارها قبل النشر.
