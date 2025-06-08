export function FAQSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How much does a website cost?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Our website packages start from £500 for a starter site. The final cost depends on your specific requirements, number of pages, and functionality needed. We offer transparent pricing with no hidden fees.",
              },
            },
            {
              "@type": "Question",
              name: "How long does it take to build a website?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Most standard websites take 2-4 weeks from concept to launch. More complex projects with custom functionality may take 4-8 weeks. We'll provide you with a specific timeline during our initial consultation.",
              },
            },
            {
              "@type": "Question",
              name: "Do you work with clients outside of Grantham?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes! While we're based in Grantham, Lincolnshire, we work with clients globally. We use video calls, email, and project management tools to collaborate effectively with clients anywhere in the world.",
              },
            },
            {
              "@type": "Question",
              name: "Will my website work on mobile devices?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Absolutely. All our websites are fully responsive and optimized for all devices including smartphones, tablets, laptops, and desktop computers. We test extensively across multiple device types and screen sizes.",
              },
            },
            {
              "@type": "Question",
              name: "Do you offer website maintenance services?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, we offer ongoing maintenance packages to keep your website secure, updated, and performing optimally. Our maintenance services include regular updates, security monitoring, backups, and technical support.",
              },
            },
            {
              "@type": "Question",
              name: "Can you help with SEO for my website?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, all our websites are built with SEO best practices in mind. We also offer additional SEO services including keyword research, on-page optimization, content creation, and local SEO to help improve your search engine rankings.",
              },
            },
          ],
        }),
      }}
    />
  )
}
