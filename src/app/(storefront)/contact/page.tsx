// app/contact/page.tsx
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="mx-auto max-w-2xl px-4 py-16">
            <div className="text-center mb-10">
                <h1 className="text-3xl text-primary mb-2">Contact us</h1>
                <p className="text-sm text-foreground/60 max-w-sm mx-auto">
                    Have a question or need help with an order? Reach out, we're happy to assist.
                </p>
            </div>

            <div className="bg-cream border border-foreground/10 rounded-card p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-5">
                    <a
                        href="mailto:thangammboutique@gmail.com"
                        className="flex items-center gap-4 group"
                    >
                        <span className="p-2.5 rounded-md bg-primary/10 text-primary shrink-0">
                            <Mail size={16} />
                        </span>
                        <div>
                            <p className="text-xs text-foreground/40 mb-0.5">Email</p>
                            <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                                hello@moms-promise.com
                            </p>
                        </div>
                    </a>

                    <a
                        href="tel:+911234567890"
                        className="flex items-center gap-4 group"
                    >
                        <span className="p-2.5 rounded-md bg-primary/10 text-primary shrink-0">
                            <Phone size={16} />
                        </span>
                        <div>
                            <p className="text-xs text-foreground/40 mb-0.5">Phone</p>
                            <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                                +91 12345 67890
                            </p>
                        </div>
                    </a>

                    <div className="flex items-center gap-4">
                        <span className="p-2.5 rounded-md bg-primary/10 text-primary shrink-0">
                            <MapPin size={16} />
                        </span>
                        <div>
                            <p className="text-xs text-foreground/40 mb-0.5">Location</p>
                            <p className="text-sm text-foreground">Tirupur, Tamil Nadu, India</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-foreground/10 pt-5">
                    <p className="text-sm text-foreground/60 text-center">
                        Mail or call us for any support or queries  we usually respond within 24 hours.
                    </p>
                </div>
            </div>
        </main >
    );
}