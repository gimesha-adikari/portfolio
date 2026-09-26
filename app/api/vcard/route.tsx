import { siteConfig } from "@/lib/siteConfig";

export async function GET() {
    const body = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${siteConfig.familyName};${siteConfig.givenName};;;`,
        `FN:${siteConfig.name}`,
        `EMAIL;TYPE=INTERNET,PREF:${siteConfig.email}`,
        `URL:${siteConfig.canonicalUrl}`,
        "END:VCARD",
        ""
    ].join("\r\n");

    return new Response(body, {
        status: 200,
        headers: {
            "Content-Type": "text/vcard; charset=utf-8",
            "Content-Disposition": 'attachment; filename="gimesha.vcf"',
            "Cache-Control": "public, max-age=86400, immutable",
        },
    });
}
