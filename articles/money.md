# Money

> [!NOTE]
> This was written with specific people in mind
> But it hopefully contains some generally useful information

Quickest tl;dr: read this damn book even if the title is dumb https://www.amazon.co.uk/Missing-Billionaires-Better-Financial-Decisions/dp/1119747910

Table of contents:

* [A tiny bit of terminology and essential maths](#a-tiny-bit-of-terminology-and-essential-maths)
* [Tax basics](#tax-basics)
* [ISA basics](#isa-basics)
* [Investment Choice](#investment-choice)
* [Emergency Money](#emergency-money)
* [Insurance](#insurance)
* [Charity and art "tax breaks" are bullshit, but donating to charity is good](#charity-and-art)
* [Resources](#resources) !! definitely look at these

# Intro

The tax/pensions/savings systems is pretty good with a few asterisks such as the tax trap. Generally, if there is a cheaper way of doing something (e.g donating to charity, or putting money in your pension), it is because _the government want to incentivise it_ rather than some Elaborate Conspiracy To Avoid Tax.

The government want you to put money in your pension (so you need less state money when retiring), so they make it cheaper to do that. Nothing in this document is even vaguely elaborate and they are all "following the incentives so that you get more money and everyone wins". 

This may seem like lots of info and specifics but the key thing is to just be aware of the concepts involved. That way when they are relevant, you can come back and read about them, read gov pages, etc, rather than not knowing they exist and losing out.

Many simplifications present. 

# A tiny bit of terminology and essential maths

* Yield = interest rate

* ETF = Exchange-traded-fund
  - Effectively a way to trade a broad basket of things as if it was a stock

* Returns = % gain
    - Absolute gain is effin useless, if something doesn't talk about returns it is not worth reading

* Risk-free rate
    - The % you get on a government bond (which is considered risk-free). The best cash interest accounts will be a tiny bit lower than this

* Volatility = standard deviation of returns

* Return profile = the mean and std dev of returns historically

* Sharpe Ratio
  - $\frac{\text{mean-of-returns} \ - \  \text{risk-free-rate}}{\text{std-dev-of-returns}}$
  - This is the only good way of measuring how good an investment is for Reasons. Anything that mentions other approaches, particularly "Sortino Ratio" should be burnt

#### Risk/utility function = function mapping money to "utility"

[covered much more extensively in the book]

Betting half your net worth on a coin flip to double/lose all your money with 51% chance of winning is technically +EV.
Clearly we need a different way to evaluate things.
Instead of optimising for "EV of money", you have a function $u(\text{money}) \to \text{utility}$, and optimise for utillity

> [!NOTE]
> Why half the net worth?
> Most risk-averse (concave) risk functions mean you NEVER take a bet that would zero your wealth
> If you do have to calculate with that assumption, firstly what the _fuck_ are you doing, and secondly just calculate with an arbitrary small value e.g 1 penny

The EV in terms of utility of the above bet is (assuming current wealth $k$):

$\mathbb{E}[\text{take bet}] = 0.49 \cdot u\bigl(\tfrac{k}{2}\bigr) + 0.51 \cdot u\bigl(\tfrac{3k}{2}\bigr)$  

$\mathbb{E}[\text{don't take bet}] = u(k)$


Key risk functions:


### Linear

$u(m) = m$

* Almost never relevant
* You would take the above bet in this system
    - $\mathbb{E}[\text{take bet}] = (0.49) \frac{k}{2} + (0.51) \frac{3k}{2} = (1.01) k$
    - $\mathbb{E}[\text{don't take bet}] = k$
    - Hence take bet

### Log

$u(m) = ln(m)$

* The basis of the Kelly criterion (maximise log-wealth)
* Invented by John Larry Kelly (lol)
* As $\lim_{c \to 0^+} \ln(c) = -\infty$, no bet that could lose all your money is ever worth taking
* You would not take the above bet
    - $\mathbb{E}[\text{take bet}] = (0.49) ln(\frac{k}{2}) + (0.51) ln(\frac{3k}{2})$
    - $\mathbb{E}[\text{don't take bet}] = ln(k)$
    - Some quick algebra (or Wolfram Alpha) shows $\mathbb{E}[\text{don't take bet}]$ is always higher than $\mathbb{E}[\text{take bet}]$

### Isoelastic / CRRA utility

```math
\begin{aligned}
u(m) = \begin{cases}
\frac{m^{1-\gamma} - 1}{1 - \gamma} & \gamma \ge 0,\ \gamma \neq 1 \\
\ln(m) & \gamma = 1
\end{cases}
\end{aligned}
```

* Parameterised by $η$ or $γ$ (same thing), which represents risk tolerance (higher = more risk averse)
    - We use $γ$
* Note the $ln(m)$ case is simply the limit of the function approaching $1$ where it is not defined
* $γ = 0$ -> same as linear risk function
* $γ = 1$ -> same as log risk function
* You would not take bet above for sensible choices of $γ$ (sensible choices = >1, and as you would not take bet at $γ = 1$, the log utility function, you would also not take it with more risk-averse choices of $γ$)

Awareness of these is key. A sensible choice to pick is CRRA with $γ = 2$, which is also often referred to as "Half-Kelly", 
as Kelly is not risk-averse enough to represent realistic IRL levels of risk aversion.

A critical concept to understand with these is that risk-averse functions like log and CRRA care about money as a _proportion_ rather than an absolute value. Mathematically, this is equivalent to " $\frac{du}{dm}$ is strictly decreasing", i.e gaining £10 is less and less useful the more money you have.

# Tax basics

The basic income tax bands:

| Name               | Range                                   | Tax  |
| ------------------ | ----------------------------------------| ---- |
| Personal Allowance | $[\mathsterling 0, \mathsterling 12{,}571)$         | 0%   |
| Basic Rate         | $[\mathsterling 12{,}571, \mathsterling 50{,}271)$  | 20%  |
| Higher Rate        | $[\mathsterling 50{,}271, \mathsterling 125{,}141)$ | 40%  |
| Additional Rate    | $[\mathsterling 125{,}141, \infty)$           | 45%  |


Tax is progressive. Any sensible tax system has two rules:
1. If you are offered a raise, it is _always_ optimal to take it. 
2. If $a > b$, then the marginal tax rate at $a$ should always be higher than the marginal tax rate at $b$

If these aren't true, weird things become optimal.

Naturally, the UK is fucking stupid and can't even follow these two rules.

For $1$, there are scenarios where earning more money **if you have a child** mean your take home pay drops.
This is not worth worrying about now, but it is very very useful to be aware of for the future. Here is take-home tax against income for a few situations.
![Image](https://preview.redd.it/seeing-the-tax-trap-v2-v0-rf5pfd1nztjd1.png?width=1080&crop=smart&auto=webp&s=3c52ea703904b98e609d20c0da1822c68adf5d42)

$2$ is true for all incomes except within the $[\mathsterling 100{,}000, \mathsterling 125{,}140]$.
At £100k, the personal allowance tapers off - for every £2 above £100k you earn, your personal allowance tapers off by £1. This leads to an effective tax of 60% in this range.

> [!TIP]
> Example - £110k salary -> £10k above £100k -> personal allowance goes down by £5k -> personal allowance of £7,570.

> [!NOTE]
> Childcare benefits also matter here at the tax trap but I will ignore them for simplicity. If they are relevant it is worth researching them

The optimal approach within this range depends on several things (regarding your value of money now vs the future).
A quick breakdown of what scenarios are most likely:

* If you value money _now_ much more than in the future, you should suck it up and accept the 60% tax on the income in that range. This is not a hugely likely scenario but could occur e.g in cases of unexpected expenses, debt, etc
* In all other scenarios, it is probably best to **salary sacrifice** money into your pension to try and avoid this trap

## Salary sacrifice

Salary sacrifice is the option of having some of your salary diverted into certain approved places _before_ it undergoes tax (most notably pensions). Doing salary sacrifice requires talking to your employer, but all big employers can do it and it is a HUGE win financialy.

The key principle is salary sacrifice lowers your taxed income. Your employee pays your sacrifice into whatever thing directly, and it is removed from your pre-tax paycheck.

Say you earn £115k a year, salary sacrifice £10k into your pension, £2.5k to a charity you care about, and £2.5k into an electric vehicle scheme that allows salary sacrifice. You effectively get a ~£8k pay raise, because if you didn't do this, the £15k above the £100k mark would be taxed at 60%.

Your salary/paychecks may be listed as or show a salary of £100k, but you are getting more money overall.

The list of things you can salary sacrifice into changes, but a rough gist is:
* Pensions (I will eat my hat if this changes)
* Charitable donations
* Electric vehicle schemes / big purchases the government wants to incentivise

Once you reach the ~£120k mark, the amount you sacrifice becomes too large to make sense.

# ISA Basics

ISA (Individual Savings Account) is possibly #1 important tool to utilise. Capital gains on an ISA are completely untaxed and they are the main way you should be saving.

There are 3 types of ISA:
* Cash ISA - for cash (shocker)
* Stocks & Shares (S&S) ISA - for investments
* Lifetime ISA - limited type of investment ISA used for house buying

> [!NOTE]
> Lifetime ISAs can sometimes be used to cleverly increase pension allowance, but are generally irrelevant. You can put up to £4k/yr into them, and the government will match 25% up to that limit (i.e free £1k per year), but their usage is very restricted. You can only take them as a pension or use them to buy a house, and the constraints on the house make this option not very useful if living in a higher cost-of-living (CoL) area, as the house price limit is £450k. If the limit on them changes, they could be worth looking at

The yearly limit for ISA contributions is £20k. You can have as many cash/S&S ISAs as you want, any combination, but the net contribution across all per year _must_ remain <=£20k. (If you have a lifetime ISA (LISA), this is effectively £16k as you would always want to put £4k/yr into that).

Cash savings are _very important_ and you should always have some. However, for reasons I shall explain, a cash ISA is simply not a good vehicle for them. Instead, for cash savings, you should you use a HYSA (High-yield savings account). Will explain further in "emergency money" section.

Key principles:
 * "volatility drag"/"volatility decay", the fact that a 10% gain and then 10% loss on an investment leads to an overall loss of 1% rather than being net neutral.
 * CGT - Capital Gains Tax - tax you get on anything that generates a return, stock investments, real estate, etc
 * Savings interest tax - tax you get on interest on cash, bonds, tax funds, and some other things

Understanding the dynamics of CGT is essential to properly use an ISA so I will quickly cover them here.

### CGT

Government page: https://www.gov.uk/capital-gains-tax

The first £3,000 of CGT you get per year is tax free. After that, it depends on whether you are a "base rate" or "higher/additional rate" tax payer. You are the latter.

The CGT after £3,000 for higher/additional rate payers is:
* 24% on your gains from residential property
* 32% on your gains from ‘carried interest’ if you manage an investment fund
* 24% on your gains from other chargeable assets

So for all simple cases, it is 24%. Note that this is much lower than income tax.

If you make a loss, that can be used to lower the CGT you pay. For up to 4 years after you make a loss, you can report it and the loss will be removed from your profits above. If losses are greater than your profits, you can carry them forward.

> [!NOTE]
> Losses are not a super likely scenario particularly with a sensible investment strategy. Learning the details of how they work isn't very important, but _awareness_ of them is, so if you do have them in a year, you can use them. They are not some weird form of elaborate tax avoidance, and just a natural consequence of how the reporting system works

The gov page has more details: https://www.gov.uk/capital-gains-tax/losses

> [!NOTE]
> Having profits and losses seperately might feel weird, but the reason is that you aren't simply reporting "how much money I made overall from gains", and so sometimes you report a profit on asset X but a loss on Y, and this mechanic is how they are aggregated together so you pay the proper rate

#### Back to ISAs

Because of the asymmetric nature of CGT - you get taxes on all gains, but losses only have limited offsetting - the fact ISAs have no CGT means they benefit from being used for certain types of savings.

Principally, your _most risky/volatile_ investment should be in your ISA. Now, the most risky/volatile investments you have should still not be very risky, and should just be boring index funds/ETFs across the whole market, but they are still much more volatile than bonds, or cash savings. This is why a cash ISA is not a good idea (the government are considering lowering the amount of money you can put into a cash ISA because of this).

Consider two investments:

* Risky - returns of (mean=10%, std dev=15%) which are vaguely realistic numbers for a sensible investment index
* Safe - has returns of (mean=4%, std dev=1%) which are vaguely realistic numbers for a cash savings account (interest rates shift around)

Risky is not actually "risky", it is just risky _relative_. You will always have more risky and less risky savings unless you are doing something disastrously wrong.

> [!NOTE]
> The tax on cash savings is different to CGT, but it is close enough that the example holds true, so we just pretend they are the same for simplicity
> Also, we are at a historical high for cash saving interest accounts. Even ~6 years ago they were less than 1/2 this, closer to (mean=1.5%, std dev=0.5%)

Assuming £10k capital for each (arbitrary), consider putting Risky in an ISA and Safe in a normal account with CGT, vs putting Risky in a normal account with CGT and Safe in an ISA.

A quick monte-carlo simulation ignoring the complexities (allowance, loss offsets) over 10yr w/ no contributions, just starting capital:

| Setup         | Mean (£) | Median (£) | 5th pct (£) | 95th pct (£) |
| ------------- | -------: | ---------: | ----------: | -----------: |
| Safe in ISA   |   36 798 |     35 102 |      25 628 |       53 818 |
| Risky in ISA  |   39 446 |     37 185 |      24 788 |       61 805 |


As you can see, having the risky in the ISA always wins. This is intuitive - as tax grows proportionally with gains, you want your bigger gains to avoid tax the most (because of volatility drag).

Ignore the absolute numbers, because it's a pretty lousy simulation, but the point is it is always better to keep riskier things in lower-tax accounts.

#### Once you hit the ISA limit

If you are in a position where you are saving >£20k a year, simply set up a GIA (General Investment Account). Manage it similarly to your ISA (but as we discussed above, anything that is lower risk should be in here). You don't get CGT exemption

# Investment Choice

(I should add info about RSUs)

Do not pick individual stocks. Do not touch options. Anyone who mentions investment strategies is a moron, scammer, possibly both.

You want broadly diversified investments that minimise fees and management complexity. You are not aiming to make money from knowing about companies, or having special information - you are making money from the world economy growing.

I will write more on high-effort selection, but genuinely the best initial advice for investing is:
* **Put everything into VWRP** (FTSE All-World UCITS ETF)
    - This is an ETF representing the entire world economy
    - It is safe, has good returns, and is very diverse
    - It is accumulating (dividends from it get auto-reinvested)

> [!NOTE]
> "Everything" means everything earmarked for investment. Obviously you need some cash as well, see the section below

More advanced approaches can be sensible (such as over-allocating to the US, or Europe, etc) but can be ignored for now.

# Emergency Money

You should obviously have an emergency money account. The rule of thumb is 6 months worth of monthly spending. There are two priorities you want to balance for this:
* Interest rate - obviously you want the highest possible interest rate you can get on it
* Ease of access - lots of the highest yield (yield=interest rate) savings accounts have withdrawal restrictions. This sucks in emergencies

You should build this up over the course of 12-24 months, speeding it up if there is layoff potential, you have more debt, spending goes up, etc.

The simplest solution:
* Find the best interest rate you can with minimal/no access restrictions and dump everything in there. Money saving expert has the best lists of cash accounts

The slightly more complex and sometimes better solution - relevant if the best account above is lower than accounts with access restrictions (generally true):
* Find the highest no restriction account, and put 1-2 months of cash in there
* Pick another account with restrictions that are workable with (ie would still let you spend the full 6 months, month-by-month, if needed, but maybe for a small fee) and higher interest rate, and put the rest in there

This approach is basically a bet on "I probably don't need the emergency money, and if I do i likely need less than 6 months". This is a pretty sensible bet to make, and the key is that you still make the 6 month scenario "good enough". But marginally more complexity, so it is a low-priority move.

# Insurance

tl;dr use calculator here to workout the max price you should pay for insurance https://johnk.dev/tools/insurance

Insurance is sometimes good and sometimes bad. This is a bit more mathsy than other sections but that is important to understanding it, and insurance is an incredibly useful thing to understand properly.

The insurer is obviously not going to sell you a policy that they lose money on. However, because your utility function is NOT linear (which is just money), insurance can be +EV utility for both you _and_ the insurer.

The cost of the policy is the "premium" $P$. A "deductible" is the cost you pay if the event occurs with insurance, and the "cost" is the cost you pay if the event occurs without insurance.

Consider this scenario:
* You purchase 1yr insurance for your laptop
* The insurance costs £100
* There is a 2.5% chance it is stolen from you within the year, which would cost you £1000, whereas with insurance you would only have to pay a £100 deductible
* There is a 15% chance you break the screen, which would cost you £300, whereas with insurance you would only have to pay a $25 deductible

What is the expected monetary loss in the year without insurance? (noting this is equivalent to "linear utility loss"):

$\mathbb{E}[\text{loss}] = (0.025) \cdot (1000) + (0.15) \cdot (300) = 70$

What about with insurance?

$\mathbb{E}[\text{loss}] = P + (0.025) \cdot (100) + (0.15) \cdot (25) = P + 6.25$

So $P + 6.25$ must be <£70 to justify the insurance.

So you would only spend <£63.75 on an insurance premium. The insurance company would never sell you this, because it is always negative expected value for them (assumption: they have a risk function that is linear or risk-averse. There are functions that are risk-seeking, but you can generally ignore them). Hence from a purely monetary perspective, you would never buy insurance.

A key assumption above is that your pre-existing wealth does not affect your utility. This is true for "the" linear utility ($u(m) = m$) and all functions which are mathematically linear (ie $\frac{du}{dm} = \text{constant}$), but is not true for our log or CRRA functions. 

It is important to think about this and understand it. If you have £1m, a loss of £1,000 does not lose much utility, but if you have £10,000 then a loss of £1,000 loses a LOT more utility, because as we explained earlier, the risk-averse functions value money as a _proportion_ rather than an _absolute_ value.

So instead of thinking about $\mathbb{E}[\text{loss}]$, we instead think about $\mathbb{E}[\text{wealth}]$, i.e how much money we expect to have after some time period T if we take insurance vs don't take it.

This means you can fully parameterise "should I buy insurance on" on:
* W - current wealth
* P - premium
* E - list of events with (probability $p$, cost w/o insurance $c$, deductible $d$)
* And let $q = 1 - \sum_{e \in \mathrm{Events}} p(e)$, i.e chance of no events happening.

Remembering that $\mathbb{E}[\text{f(X)}] = \sum_{x \in \mathrm{X}} {p(x) \cdot f(x)}$, we can see the general form is "wealth if nothing happens * chance nothing happens" + (for each event, "wealth if event happens * chance of event):

With insurance:

```math
\mathbb{E}[\text{u(wealth)}] = q \cdot ln(W - P) + \sum_{e \in \mathrm{Events}} {p(e) \cdot u(W - P - d_e) }
```

Without insurance:
```math
\mathbb{E}[\text{u(wealth)}] = q \cdot ln(W) + \sum_{e \in \mathrm{Events}} {p(e) \cdot u(W - c_e) }
```

Again looking at linear function, we now do $\mathbb{E}[\text{wealth}]$

Without insurance:

$\mathbb{E}[\text{wealth}] = W - (0.025) \cdot (1000) - (0.15) \cdot (300) = W - 70$

With insurance:

$\mathbb{E}[\text{wealth}] = W - P - (0.025) \cdot (100) - (0.15) \cdot (25) = W - P - 6.25$

So the `W` cancels out and againt the condition is "premium <£63.75".

Now consider our log risk function

> [!NOTE]
> Again, crra $γ = 2$ is better, but it is more mathematically complex
> 
> Because crra $γ > 1$ is strictly more risk-averse than log, and log is strictly more risk-averse than linear, you can apply transitivity:
> * If you would take A with linear function but not with log, you WOULD NOT take it with crra $γ > 1$
> * If you would not take A with linear function but would with log, you WOULD take it with crra $γ > 1$

Without insurance (we must now put terms within the percentages, as log is not distributive):

```math
\mathbb{E}[\text{ln(wealth)}] = q \cdot ln(W) + (0.025) \cdot ln(W - 1000) + (0.15) \cdot ln(W - 300)
```

With insurance:

```math
\mathbb{E}[\text{ln(wealth)}] = q \cdot ln(W - P) + (0.025) \cdot ln(W - P - 100) + (0.15) \cdot ln(W - P - 25)
```

In general, the introduction of deductibles makes this non-analytic. However you can of course calculate both
* What wealth W do I need for a premium P to not be worth it?
* What premium P should I be willing to pay with wealth W?

Let's assume our wealth is £10,000, and determine what premium we should pay (by plugging values into WolframAlpha).

We solve:

```math
\mathbb{E}[\ln(\text{wealth with insurance} \mid W = 10{,}000)] 
> 
\mathbb{E}[\ln(\text{wealth without insurance} \mid W = 10{,}000)]
```

And we get $P = 65.5047$, so we should willing to pay a bit more for insurance than the linear case.
However, what if we have less money? Say £2,000

```math
\mathbb{E}[\ln(\text{wealth with insurance} \mid W = 2{,}000)] 
> 
\mathbb{E}[\ln(\text{wealth without insurance} \mid W = 2{,}000)]
```

In this case, we get $P = 75.3661$. This makes sense - the costs we could incur are a larger proportion of our wealth, so we are willing to pay more money to avoid them.

You can consider the insurer as having a linear risk function for each policy because they rely on the law of large numbers across many insurance policies so that their chance of going bankrupt is very low. This means they may offer us a premium for £70, which is positive EV for them, as it is >£63.75, and positive EV for us, as it is <£75.3661. This is the genius of insurance, where it is positive utility for _both_ participants.

I have a calculator for this at https://johnk.dev/tools/insurance

# Charity and Art

No, you cannot magically save tax on charity or art purchases. Anyone who says otherwise is a snake-oil salesman or is complaining about tax without understanding it.

If you donate £5k to a charity, you can get tax-relief on that £5k. This is _exactly equivalent_ to doing it via salary sacrifice. The point is that instead of spending say £10k of your pre-tax salary to donate £5k to a charity (because 50% of your salary was taxed), you can spend £5k and the charity gets the entire amount. It is a rule designed to incentivise donating to charity, because that is a good thing, and it helps the charity rather than you. If the rule did not exist, you donating £5k _post-tax_ to charity would just give them £5k, but this way they get it pre-tax and so closer to £10k.
Art is the same thing, if you buy and donate it to a museum you can get a refund on the tax, because you have donated it. 

Neither of these save money compared to _not doing them_. They just make it cheaper to do them.

# Resources

#### The Missing Billionaires

Cringe name, but the single best book I have read on personal finance management in my life. I recommend it to everyone like a broken record. If there is one book you ever read on the topic, it should be this.

The very high level gist is "risk management and allocating things is way way way more important than picking investments".
Understanding your own personal risk tolerance is incredibly valuable.

* Amazon: https://www.amazon.co.uk/Missing-Billionaires-Better-Financial-Decisions/dp/1119747910

#### UK Personal finance:

Excellent resource. Although reddit and discord are cringe, the info on here is incredibly good.

* Subreddit: https://www.reddit.com/r/UKPersonalFinance/
* Wiki: https://ukpersonal.finance
* Discord: https://discord.gg/kaetMg8

#### HENRY UK

HENRY = High Earner, Not Rich Yet = people on high salaries who are young.
Again super cringe name, but contains lots of useful info regarding tax traps, ISAs, the stuff in this document. The reality is the advice in the higher earning ranges (>£80k TC) can be quite different and so you need to look at advice specifically for that.

* Subreddit: https://www.reddit.com/r/HENRYUK/

