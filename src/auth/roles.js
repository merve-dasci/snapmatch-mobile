import { ShieldCheck, Camera, CalendarCheck, UploadCloud, UserRound } from "lucide-react";

// İşletme (Fotoğrafçı) Admini rotaları
const BUSINESS_ROUTES = [
    "/home",
    "/dashboard",
    "/events",
    "/events/:id",
    "/upload",
    "/participants",
    "/matching",
    "/review",
    "/qr",
    "/analytics",
    "/team",
    "/settings",
    "/messages",
];

// Tüm sistem rotaları (Sadece Platform Admini görebilir)
const PLATFORM_ROUTES = [
    ...BUSINESS_ROUTES,
    "/roles",
    "/access-matrix",
    "/customers",
];

// Erişim Matrisi'nden (6.2) türetilmiş rol tanımları.
// password: sadece demo amaçlı; gerçek kimlik doğrulama backend'de yapılır.
export const ROLES = {
    platform_admin: {
        id: "platform_admin",
        label: "Platform Yöneticisi",
        tag: "Sistem",
        name: "Deniz Yıldız",
        email: "admin@snapmatch.io",
        password: "123456",
        icon: ShieldCheck,
        color: "var(--color-blue-dark)",
        home: "/home",
        blurb:
            "Tüm çalışma alanlarını, plan limitlerini, sistem günlüklerini ve depolama kullanımını izlersiniz.",
        allowed: PLATFORM_ROUTES,
    },
    business_admin: {
        id: "business_admin",
        label: "Fotoğrafçı / İşletme Yöneticisi",
        tag: "Ana Müşteri",
        name: "Ezgi Çelik",
        email: "ezgi@snapmatch.me",
        password: "123456",
        icon: Camera,
        color: "var(--accent-green)",
        home: "/home",
        blurb: "",
        allowed: BUSINESS_ROUTES,
    },
    event_owner: {
        id: "event_owner",
        label: "Etkinlik Sorumlusu / Organizatör",
        tag: "Operasyon",
        name: "Merve Yılmaz",
        email: "merve@snapmatch.me",
        password: "123456",
        icon: CalendarCheck,
        color: "var(--color-blue-medium)",
        home: "/home",
        blurb:
            "Atandığınız etkinliği yönetir, katılımcı listesini görür, eşleşmeleri onaylar/reddeder, QR ve erişim ayarlarını düzenlersiniz.",
        allowed: [
            "/home",
            "/events",
            "/events/:id",
            "/participants",
            "/review",
            "/qr",
            "/settings",
            "/messages",
        ],
    },
    uploader: {
        id: "uploader",
        label: "Yükleyici / Fotoğrafçı Asistanı",
        tag: "Ekip",
        name: "Kemal Altın",
        email: "kemal@snapmatch.me",
        password: "123456",
        icon: UploadCloud,
        color: "var(--accent-yellow)",
        home: "/home",
        blurb:
            "Fotoğraf yükler, eşleşme ve katılımcı verilerine sınırlı olarak (salt okunur) erişirsiniz.",
        allowed: ["/home", "/upload", "/participants", "/review", "/analytics", "/settings", "/messages"],
    },
    // Katılımcı / Misafir: QR ile onboarding'den geçer (e-posta/şifre hesabı yoktur),
    // ardından kendi paneline (Fotoğraflarım) düşer. Yetkisi sadece kendi eşleşmeleridir.
    katilimci: {
        id: "katilimci",
        label: "Katılımcı / Misafir",
        tag: "Son Kullanıcı",
        name: "Zeynep Kaya",
        icon: UserRound,
        color: "var(--color-blue-soft)",
        home: "/my-photos",
        blurb:
            "Fotoğrafları işler, yüzleri tespit eder, katılımcı yüz kayıtlarıyla karşılaştırır, güven skoru üretir ve review kuyruğuna sonuç yazar.",
        allowed: ["/home", "/my-photos", "/matching", "/settings", "/messages"],
    },
};

// Giriş için hesap listesi (yalnızca e-posta/şifre'si olan roller)
export const ACCOUNTS = Object.values(ROLES)
    .filter((r) => r.email && r.password)
    .map((r) => ({ role: r.id, email: r.email, password: r.password }));

// Rol id'sinden giriş yapan kullanıcı nesnesi üretir
export function userFromRole(roleId) {
    const r = ROLES[roleId];
    if (!r) return null;
    const initials = r.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    return { role: r.id, name: r.name, email: r.email || "", initials };
}