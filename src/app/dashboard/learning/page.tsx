const learningPaths = [
  {
    title: "Cold Wallet Security",
    description:
      "Learn how offline storage protects private keys and how to secure your digital assets.",
    lessons: "8 Lessons",
    level: "Beginner",
  },
  {
    title: "Blockchain Fundamentals",
    description:
      "Understand blockchain networks, transactions, confirmations, and digital ownership.",
    lessons: "10 Lessons",
    level: "Beginner",
  },
  {
    title: "Portfolio Management",
    description:
      "Learn asset allocation, diversification, and strategies for managing digital assets.",
    lessons: "6 Lessons",
    level: "Intermediate",
  },
];


const articles = [
  {
    title: "What Is a Cold Wallet?",
    category: "Security",
    level: "Beginner",
    time: "5 min read",
    description:
      "Understand how cold wallets work, why offline storage improves security, and when to use one.",
  },

  {
    title: "Protecting Your Seed Phrase",
    category: "Security",
    level: "Beginner",
    time: "7 min read",
    description:
      "Best practices for protecting recovery phrases and avoiding common wallet security mistakes.",
  },

  {
    title: "Bitcoin Explained",
    category: "Bitcoin",
    level: "Beginner",
    time: "8 min read",
    description:
      "Learn how Bitcoin transactions, mining, and blockchain verification work.",
  },

  {
    title: "Ethereum and Smart Contracts",
    category: "Ethereum",
    level: "Intermediate",
    time: "10 min read",
    description:
      "Explore Ethereum, decentralized applications, and smart contract technology.",
  },

  {
    title: "Managing a Crypto Portfolio",
    category: "Investing",
    level: "Intermediate",
    time: "9 min read",
    description:
      "Learn how to organize holdings, monitor performance, and manage risk.",
  },

  {
    title: "Understanding Blockchain Networks",
    category: "Blockchain",
    level: "Advanced",
    time: "12 min read",
    description:
      "Explore networks, confirmations, validators, and transaction fees.",
  },

];


const securityTips = [
  "Never share your recovery phrase or private keys.",
  "Verify wallet addresses before sending funds.",
  "Use hardware wallets for long-term storage.",
  "Enable two-factor authentication whenever available.",
];



export default function LearningPage() {


return (

<div className="space-y-8">


<section>

<h1 className="text-3xl font-bold text-white">

Learning Center

</h1>


<p className="mt-2 text-slate-400">

Learn cryptocurrency, blockchain technology, and secure digital asset management.

</p>


</section>







<section

className="
rounded-3xl
border
border-cyan-500/20
bg-gradient-to-br
from-cyan-500/10
to-slate-950
p-8
"

>


<h2 className="text-2xl font-bold text-white">

Start Your Digital Asset Journey

</h2>


<p className="mt-3 max-w-2xl text-slate-300">

Build your knowledge with guides focused on security, blockchain education, portfolio management, and responsible digital asset ownership.

</p>


<button

className="
mt-6
rounded-lg
bg-cyan-500
px-5
py-3
font-medium
text-black
hover:bg-cyan-400
"

>

Explore Guides

</button>


</section>








<section>


<h2 className="mb-5 text-xl font-semibold text-white">

Learning Paths

</h2>



<div className="grid gap-6 md:grid-cols-3">


{
learningPaths.map((path)=>(

<div

key={path.title}

className="
rounded-xl
border
border-slate-800
bg-slate-950
p-6
"

>


<span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-400">

{path.level}

</span>



<h3 className="mt-4 text-lg font-semibold text-white">

{path.title}

</h3>


<p className="mt-3 text-sm text-slate-400">

{path.description}

</p>


<p className="mt-5 text-sm text-cyan-400">

{path.lessons}

</p>


</div>

))

}


</div>


</section>








<section>


<h2 className="mb-5 text-xl font-semibold text-white">

Featured Articles

</h2>



<div className="grid gap-6 md:grid-cols-2">


{
articles.map((article)=>(


<div

key={article.title}

className="
rounded-xl
border
border-slate-800
bg-slate-950
p-6
transition
hover:border-cyan-500
"

>


<div className="flex justify-between">


<span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-400">

{article.category}

</span>


<span className="text-xs text-slate-400">

{article.time}

</span>


</div>



<h3 className="mt-5 text-xl font-semibold text-white">

{article.title}

</h3>



<p className="mt-3 text-slate-400">

{article.description}

</p>



<p className="mt-5 text-sm text-purple-400">

{article.level}

</p>


<button

className="
mt-5
rounded-lg
border
border-slate-700
px-4
py-2
text-sm
text-white
hover:bg-slate-800
"

>

Read Article

</button>


</div>


))

}


</div>


</section>








<section

className="
rounded-xl
border
border-slate-800
bg-slate-950
p-6
"

>


<h2 className="text-xl font-semibold text-white">

Security Essentials

</h2>


<div className="mt-5 space-y-3">


{
securityTips.map((tip)=>(


<div

key={tip}

className="
rounded-lg
bg-slate-900
p-4
text-slate-300
"

>

✓ {tip}

</div>


))

}


</div>


</section>





</div>

);


}