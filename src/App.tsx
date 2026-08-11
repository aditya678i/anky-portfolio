import React, { useEffect, useState } from "react"
import ParallaxHero from "./components/ParallaxHero"
import AboutMe from "./components/AboutMe"
import InfiniteShortsCarousel from "./components/InfiniteShortsCarousel"
import InfiniteLongsCarousel from "./components/InfiniteLongsCarousel"
import ServicesScroll from "./components/ServicesScroll"
import PricingSection from "./components/PricingSection"
import PremiumTestimonials from "./components/PremiumTestimonials"
import FaqMonochrome from "./components/FaqMonochrome"
import AestheticFooter from "./components/AestheticFooter"

import "./index.css"

// Responsive card size hook
function useCardSizes() {
    const [sizes, setSizes] = useState({
        shortsW: 280,
        shortsH: 500,
        longsW: 560,
        longsH: 315,
    })

    useEffect(() => {
        function calc() {
            const vw = window.innerWidth
            // Shorts: 9:16 ratio, center card fits ~55% of vw on mobile, max 280
            const shortsW = Math.min(280, Math.round(vw * 0.55))
            const shortsH = Math.round(shortsW * (16 / 9))
            // Longs: 16:9 ratio, center card fits ~80% of vw on mobile, max 560
            const longsW = Math.min(560, Math.round(vw * 0.8))
            const longsH = Math.round(longsW * (9 / 16))
            setSizes({ shortsW, shortsH, longsW, longsH })
        }
        calc()
        window.addEventListener("resize", calc)
        return () => window.removeEventListener("resize", calc)
    }, [])

    return sizes
}

function App() {
    const { shortsW, shortsH, longsW, longsH } = useCardSizes()

    useEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = "smooth"
    }, [])

    return (
        <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", width: "100%", maxWidth: "100vw", overflowX: "clip" }}>
            <style dangerouslySetInnerHTML={{__html: `
                /* ── Pricing sticky ─────────────────────────────────────── */
                .pricing-sticky-wrapper {
                    position: -webkit-sticky;
                    position: sticky;
                    top: 0;
                    z-index: 0;
                    background-color: #e6e9ee;
                    min-height: 100vh;
                    height: auto;
                    overflow-y: auto;
                    overflow-x: hidden;
                    display: block;
                }
                .pricing-sticky-wrapper::-webkit-scrollbar { display: none; }
                .pricing-sticky-wrapper { -ms-overflow-style: none; scrollbar-width: none; }

                @media (max-width: 1024px) {
                    .pricing-sticky-wrapper {
                        position: relative !important;
                        top: auto !important;
                        min-height: auto !important;
                        padding-top: 40px;
                        padding-bottom: 60px;
                    }
                }

                /* ── Long Form sticky ───────────────────────────────────── */
                .longform-sticky-wrapper {
                    position: sticky;
                    top: 0;
                    z-index: 0;
                    height: 100svh;
                    min-height: 500px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    background-color: #000;
                }

                @media (max-width: 768px) {
                    .longform-sticky-wrapper {
                        position: relative !important;
                        height: auto !important;
                        min-height: auto !important;
                        padding: 60px 0 40px;
                    }
                }

                /* ── Section headings ───────────────────────────────────── */
                .section-heading {
                    font-size: clamp(36px, 9vw, 56px);
                    font-family: Inter, sans-serif;
                    font-weight: 800;
                    margin: 0;
                    letter-spacing: -0.02em;
                    color: #ffffff;
                }
            `}} />

            <ParallaxHero 
                name="HI I'M ANKY" 
                buttonText="Get Started"
                buttonLink="https://www.instagram.com/ankyym/"
                image="/hero-image.png"
                navLinks={["About Me", "Content", "Services", "Pricing", "FAQ", "Contact"]}
                avatars={[
                    "/melvin.avif",
                    "/loony.avif",
                    "/fosteringwoods.avif",
                    "/luxe.avif"
                ]}
                avatarSize={40}
                clientText="50+ more clients"
            />
            
            <div id="about">
                <AboutMe 
                    backgroundColor="#000000"
                    textColor="#ffffff"
                    accentColor="#FF6B00"
                    profileImage="/about-image.jpeg"
                    greeting="Hi, I'm Anky."
                    paragraph1="I transform raw footage into engaging, high-quality videos that capture attention and tell compelling stories."
                    paragraph2="From YouTube content and social media reels to promotional and commercial edits, every project is crafted with precision and creativity."
                    paragraph3="My focus is on delivering polished visuals, seamless transitions, and a final result that helps brands and creators stand out."
                    buttons={[
                        { icon: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg", link: "https://www.adobe.com/products/aftereffects.html", iconPadding: 10 },
                        { icon: "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg", link: "https://www.adobe.com/products/premiere.html", iconPadding: 10 },
                        { icon: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg", link: "https://www.adobe.com/products/photoshop.html", iconPadding: 10 }
                    ]}
                />
            </div>
            
            {/* ── Short Form Content ── */}
            <div id="content" style={{ paddingTop: 'clamp(40px, 6vw, 80px)', textAlign: 'center' }}>
                <h2 className="section-heading"><span style={{ color: '#FF6B00' }}>Short</span> Form Content</h2>
            </div>
            <InfiniteShortsCarousel 
                videos={[
                    "https://youtube.com/shorts/b-TRNqd_JjA?si=R6bzP4YJVnxPnaf6",
                    "https://youtube.com/shorts/8ZuVjXtLMkI?si=Nnshaupa2-M70n_k",
                    "https://youtu.be/3WaONxFTSq8?si=c1wIHMoeQm-mRQdh",
                    "https://youtu.be/zdxg7BI2ob8?si=jYkncyS1_NaqRFPT",
                    "https://youtu.be/Ba35cZssW6Q?si=0vr_e4pJOBiP1qIc",
                ]}
                cardWidth={shortsW}
                cardHeight={shortsH}
                arrowColor="#FFFFFF"
            />
            
            {/* ── Long Form Content ── */}
            <div style={{ position: "relative" }}>
                <div className="longform-sticky-wrapper">
                    <div style={{ textAlign: 'center', marginBottom: "clamp(10px, 2vw, 20px)" }}>
                        <h2 className="section-heading"><span style={{ color: '#FF6B00' }}>Long</span> Form Content</h2>
                    </div>
                    <InfiniteLongsCarousel 
                        videos={[
                            "https://youtu.be/ip4p0vI5Xss?si=WUNCRcqCN_cdBD5M",
                            "https://youtu.be/nDOGAu3sOrc?si=FKmyONUa3D_H4-uq",
                            "https://youtu.be/CtCD72BISU8?si=PnWqhX5fFYSNeypn",
                            "https://youtu.be/WiS4soBBOlU?si=YKTycx-XiPw0QUVb",
                            "https://youtu.be/w8BhxO8SfMo?si=3MsE2MDkdrmS4LQz",
                            "https://youtu.be/GwTI76QtO9k?si=uqCm9JIkCK56Wp4E"
                        ]}
                        cardWidth={longsW}
                        cardHeight={longsH}
                        arrowColor="#FFFFFF"
                    />
                </div>
                
                <div id="services" style={{ position: "relative", zIndex: 10, backgroundColor: "#e6e9ee" }}>
                    <ServicesScroll 
                        mainTitle="SERVICES"
                        backgroundColor="#e6e9ee"
                        services={[
                            { title: "Short Form Video", description: "I create fast-paced, attention-grabbing edits built for today's short-form world — whether it's Reels, Shorts, or TikTok. The goal is simple: hook people instantly, keep them watching, and make every second hit." },
                            { title: "Thumbnail Design", description: "Your thumbnail decides whether someone clicks or scrolls. I design thumbnails that instantly grab attention, match your content's vibe, and make your videos stand out in a crowded feed without looking clickbaity." },
                            { title: "Long-Form Video", description: "I turn raw footage into polished long-form videos that actually keep people watching. Whether it's a vlog, documentary-style piece, commentary, or a detailed breakdown, I focus on making the pacing, storytelling, and overall experience feel smooth, engaging, and worth staying for." }
                        ]}
                    />
                </div>
            </div>
            
            {/* ── Pricing + Testimonials ── */}
            <div style={{ position: "relative" }}>
                <div id="pricing" className="pricing-sticky-wrapper">
                    <PricingSection />
                </div>
                
                <div id="testimonials" style={{ position: "relative", zIndex: 10, backgroundColor: "#000", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <PremiumTestimonials 
                        title="What Clients Are Saying"
                        speed={150}
                        backgroundColor="#000000"
                        textColor="#ffffff"
                        cardBackground="#0a0a0a"
                        cards={[
                            { 
                                name: "Melvin's Enterprises", 
                                company: "Content Creator", 
                                review: "Anky is the BEST editor I have worked with, hands down! The attention to detail, creativity, and visual appeal in the delivery were top-notch. Outstanding cooperation. 🙌", 
                                avatar: "/melvin.avif", 
                                rating: 5 
                            },
                            { 
                                name: "Loony", 
                                company: "Content Creator", 
                                review: "Highly motivated, takes feedback and replies quickly. Good final product.", 
                                avatar: "/loony.avif", 
                                rating: 4.5 
                            },
                            { 
                                name: "Fosteringwoods", 
                                company: "Content Creator", 
                                review: "He did a great job! He took feedback extremely well! I was very hands off and I was happy with the video!", 
                                avatar: "/fosteringwoods.avif", 
                                rating: 5 
                            },
                            { 
                                name: "Luxe", 
                                company: "Content Creator", 
                                review: "Skilled and professional. Great editor", 
                                avatar: "/luxe.avif", 
                                rating: 5 
                            },
                            { 
                                name: "Jillian Brown", 
                                company: "Content Manager", 
                                review: "I was blown away by the work done on my YouTube video! They did a fantastic job editing it and making it super funny. I'm stoked to have the chance to work with them again in the future. They seriously exceeded my expectations, and I was thrilled to see the final product days ahead of schedule without sacrificing quality. Plus, their communication was top-notch—fast and professional. I'm super impressed! 10/10 recommend!", 
                                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", 
                                rating: 5 
                            }
                        ]}
                    />
                </div>
            </div>
            
            <div id="faq">
                <FaqMonochrome 
                    theme="Dark"
                    heading="Frequently Asked Questions"
                    padding={80}
                    maxWidth={900}
                    items={[
                        { question: "What videos do you edit?", answer: "I edit YouTube videos, reels, and short videos. I make them fun and easy to watch till the end." },
                        { question: "How can editing make my video more engaging?", answer: "Good editing keeps people watching longer. I use music, subtitles, sound effects, cuts, and pacing to make the video feel more exciting and less boring." },
                        { question: "Can I ask for changes?", answer: "Yes, of course. If you want something changed, I will fix it until you are happy with the final video." },
                        { question: "What do you need from me?", answer: "Just send: Your raw clips, Your idea or reference (optional), Music, logo, or anything you want added. That's all." },
                        { question: "How much do you charge?", answer: "The price depends on the video length and editing style. Send me the details and I'll give you a fair price." },
                        { question: "Ready to get started? How can I contact you?", answer: "Just send me a message on my social media or email. I usually reply quickly and we can start right away." }
                    ]}
                />
            </div>
            
            <div id="contact">
                <AestheticFooter 
                    headingText="Let's build something great."
                    mainText="Anky M"
                    mainLink="#content"
                    backgroundColor="#050505"
                    textColor="#ffffff"
                    accentColor="#a3a3a3"
                    socialHeading="Let's connect!"
                    socialIcons={[
                        { link: "https://www.instagram.com/ankyym/", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" },
                        { link: "https://x.com/notankyy", icon: "https://cdn.simpleicons.org/x/ffffff" },
                        { link: "https://linkedin.com/in/ankitmoitra", icon: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" }
                    ]}
                    sectionHeading="Section"
                    sectionLinks={[
                        { text: "Work", link: "#content" },
                        { text: "Services", link: "#services" },
                        { text: "Testimonials", link: "#testimonials" },
                        { text: "Pricing", link: "#pricing" },
                        { text: "FAQ", link: "#faq" }
                    ]}
                />
            </div>
        </div>
    )
}

export default App
