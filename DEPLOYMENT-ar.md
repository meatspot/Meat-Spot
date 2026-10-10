# متابعة الربط والنشر
اقرأ CLOUD-STATE-ar.md للحالة الفعلية. المستودع ومشروع Supabase ومشروع Vercel أُنشئت روابطها الأساسية، ولا تستخدم الحسابات والمشاريع القديمة.

## المتبقي
1. إكمال DNS في TransIP بالقيم الخاصة بالمشروع في CLOUD-STATE-ar.md ثم التحقق من SSL ومن عرض الدومين.
2. منح اتصال Vercel صلاحية الفريق والمشروع لقراءة السجلات وفحص النشر المحمي. تحقق من Git connection في Project Settings → Git ليصبح push تلقائياً.
3. إضافة SUPABASE_SECRET_KEY كـ Secret إلى الخادم من مشروع Supabase الصحيح. الإضافة الحالية تكشف مفاتيح الواجهة العامة فقط؛ أداة المتصفح متوقفة. لا يُنشر المفتاح في Git أو NEXT_PUBLIC.
4. إعداد Google provider في Supabase بالمفاتيح من مشروع Google Cloud المعتمد، دون إرسالها في المحادثة. رابط Google callback: https://rnkxuknblzsbnauwjdds.supabase.co/auth/v1/callback. اضبط Supabase Site URL=https://meat-spot.nl وعنوان redirect https://meat-spot.nl/auth/callback، وعناوين معاينة معتمدة إن احتجت اختبارها.
5. إعداد Resend ودومين إرسال متحقق، ثم RESEND_API_KEY وEMAIL_FROM كأسرار/إعدادات خادم. CRON_SECRET أُعدّ بالفعل، لكن جدولة الإعادة لم تُفعّل.
6. مراجعة صور وأسماء ووحدات وكميات وأسعار المنتجات، ونشر الأقسام أولاً. المسودات لا تتضمن أسعاراً مفترضة.
7. إدخال النصوص القانونية بأربع لغات واعتماد ساعات ومواعيد الاستلام والسعة ووقت التجهيز. لا تمكّن الطلبات قبل اختبار الدخول والبريد ودورة الطلب.
8. تأكيد الرمز البريدي وإحداثيات المحل وGoogle Place ID قبل إضافتها من لوحة الإدارة.
9. تقييد Maps Embed key بنطاق الموقع وبـ Maps Embed API فقط. تحقق من Search Console ثم أرسل sitemap.xml؛ تحقق من Google Business Profile الصحيح وأضف الرابط والصور الحقيقية.

## متغيرات البيئة
NEXT_PUBLIC_SUPABASE_URL وNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY عامان وضُبطا. OWNER_ADMIN_EMAIL وBUSINESS_NOTIFICATION_EMAIL ضُبطا كمتغيرات خاصة. APP_URL للإنتاج meat-spot.nl وللمعاينة meat-spot-meatspot.vercel.app. CRON_SECRET سري ولا يُطبع.
المتبقي SUPABASE_SECRET_KEY وRESEND_API_KEY وEMAIL_FROM وMaps Embed key ورمز Search Console بحسب الخدمة.
لا تُرسل مفاتيح في المحادثة، ولا تضعها في ملفات الواجهة أو سجلات البناء.

## التحقق النهائي
العميل يدخل Google ويضيف منتجات حقيقية مسعرة ويحجز موعداً، يرى طلباته وحدها، وتتلقى الإدارة الإشعار وتغيّر الحالة. إعادة الإرسال لا تكرر الطلب، والإلغاء يعيد السعة مرة واحدة. اختبر عرض الهاتف والكمبيوتر واللغات الأربع والروابط والصور والدومين وشهادة SSL.
فهرسة Google وظهور Maps يحتاجان إجراءات التحقق لدى Google؛ لا ضمان للموعد أو الترتيب.
