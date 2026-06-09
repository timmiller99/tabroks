/**
 * TabRoks — Smart Tab Categorization Engine
 * by DigitalRoks (digitalroks.com)
 *
 * Category rules: each entry maps a group name to an array of
 * domain/keyword patterns. Patterns are matched against the tab's
 * hostname and title (case-insensitive).
 */

const CATEGORIES = [
  {
    name: "🤖 LLMs",
    color: "purple",
    patterns: [
      "claude.ai", "anthropic.com",
      "chat.openai.com", "chatgpt.com",
      "gemini.google.com", "aistudio.google.com",
      "grok.com", "x.ai",
      "genspark.ai",
      "manus.im",
      "perplexity.ai",
      "copilot.microsoft.com",
      "poe.com",
      "huggingface.co",
      "mistral.ai",
      "cohere.com",
      "groq.com",
      "together.ai",
      "replicate.com",
      "deepseek.com",
      "you.com"
    ]
  },
  {
    name: "⚡ Automation",
    color: "orange",
    patterns: [
      "zapier.com",
      "make.com", "integromat.com",
      "n8n.io",
      "pipedream.com",
      "activepieces.com",
      "automate.io",
      "ifttt.com",
      "airtable.com",
      "notion.so",
      "clickup.com",
      "monday.com",
      "asana.com",
      "trello.com",
      "retool.com",
      "bubble.io",
      "webflow.com",
      "vercel.com",
      "netlify.com",
      "render.com",
      "railway.app",
      "supabase.com",
      "firebase.google.com"
    ]
  },
  {
    name: "💼 Business",
    color: "blue",
    patterns: [
      "digitalroks.com",
      "mcphubz.com",
      "gozealio.com",
      "pdhandy",
      "quickbooks.com",
      "freshbooks.com",
      "wave.com",
      "stripe.com",
      "paypal.com",
      "square.com",
      "shopify.com",
      "godaddy.com",
      "namecheap.com",
      "cloudflare.com",
      "google.com/business",
      "yelp.com",
      "thumbtack.com",
      "angi.com",
      "homeadvisor.com",
      "craigslist.org",
      "nextdoor.com",
      "docusign.com",
      "hellosign.com"
    ]
  },
  {
    name: "📣 Marketing & SEO",
    color: "green",
    patterns: [
      "semrush.com",
      "ahrefs.com",
      "moz.com",
      "ubersuggest.com",
      "search.google.com",
      "analytics.google.com",
      "ads.google.com",
      "facebook.com/ads",
      "business.facebook.com",
      "mailchimp.com",
      "convertkit.com",
      "klaviyo.com",
      "hubspot.com",
      "buffer.com",
      "hootsuite.com",
      "later.com",
      "canva.com",
      "figma.com",
      "adobe.com"
    ]
  },
  {
    name: "📱 Social Media",
    color: "pink",
    patterns: [
      "facebook.com",
      "instagram.com",
      "twitter.com", "x.com",
      "linkedin.com",
      "tiktok.com",
      "youtube.com",
      "reddit.com",
      "pinterest.com",
      "snapchat.com",
      "threads.net",
      "discord.com",
      "slack.com",
      "telegram.org",
      "whatsapp.com"
    ]
  },
  {
    name: "💻 Dev & Code",
    color: "cyan",
    patterns: [
      "github.com",
      "gitlab.com",
      "bitbucket.org",
      "stackoverflow.com",
      "codepen.io",
      "codesandbox.io",
      "replit.com",
      "npmjs.com",
      "pypi.org",
      "developer.mozilla.org",
      "docs.google.com",
      "developers.google.com",
      "aws.amazon.com",
      "console.cloud.google.com",
      "portal.azure.com",
      "digitalocean.com",
      "heroku.com"
    ]
  },
  {
    name: "🔍 Research",
    color: "yellow",
    patterns: [
      "google.com",
      "bing.com",
      "duckduckgo.com",
      "wikipedia.org",
      "medium.com",
      "substack.com",
      "arxiv.org",
      "scholar.google.com",
      "news.ycombinator.com",
      "techcrunch.com",
      "wired.com",
      "theverge.com",
      "producthunt.com"
    ]
  },
  {
    name: "🛒 Shopping",
    color: "red",
    patterns: [
      "amazon.com",
      "ebay.com",
      "etsy.com",
      "walmart.com",
      "target.com",
      "bestbuy.com",
      "homedepot.com",
      "lowes.com",
      "costco.com",
      "aliexpress.com"
    ]
  }
];

// Export for use in background.js and popup.js
if (typeof module !== "undefined") {
  module.exports = { CATEGORIES };
}
