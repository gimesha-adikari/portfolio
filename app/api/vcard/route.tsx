export async function GET() {
    const body = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "N:Nirmal;Gimesha;;;",
        "FN:Gimesha Nirmal",
        "EMAIL;TYPE=INTERNET,PREF:gimeshanirmal23@gmail.com",
        "URL:https://gimesha.dev",
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
