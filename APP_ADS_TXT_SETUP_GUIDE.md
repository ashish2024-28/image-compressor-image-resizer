# AdMob app-ads.txt Complete Step-by-Step Guide

Bhai, aapko tension lene ki koi zarurat nahi hai! Sab kuch bohot simple hai. 
Aapke code me **`public/app-ads.txt`** file already bana di gayi hai aapki exact ID ke saath:
```text
google.com, pub-6284694302866330, DIRECT, f08c47fec0942fa0
```

---

## Yeh `app-ads.txt` hota kya hai? (Why AdMob needs it)
Google AdMob aur Play Store / App Store fraud ko rokne ke liye yeh rule lagate hain.
Jab aap apne app me ads chalate hain, toh AdMob check karta hai:
1. Aapke mobile app ke Google Play Store listing me kaun si **Website URL** dali hui hai.
2. Us website ke `/app-ads.txt` par jakar Google check karta hai ki aapka `pub-6284694302866330` wahan likha hai ya nahi.
3. Agar match ho gaya, toh AdMob aapko **"Authorized" / "Verified" (Green)** mark kar deta hai aur ads live ho jaate hain.

---

## 5 Simple Steps (Step-by-Step Guide):

### Step 1: Git Push to GitHub (Code update deploy karein)
Aapne jo naye changes humne kiye hain, unhe GitHub pe push karein:
```bash
git add .
git commit -m "Add AdMob app-ads.txt and AdSense pub-6284694302866330"
git push origin main
```
*Note: Vercel automatically naya version 1 minute me live kar dega.*

---

### Step 2: Browser me check karein (Verification)
Apna browser (Chrome/Edge) kholein aur apni website ka URL check karein:
- **`https://yourdomain.com/app-ads.txt`**
(e.g., `https://image-optimizer.dev/app-ads.txt` ya jo bhi aapka Vercel domain hai jaise `https://xyz.vercel.app/app-ads.txt`)

Aapko screen par yeh ek line dikhai deni chahiye:
```text
google.com, pub-6284694302866330, DIRECT, f08c47fec0942fa0
```
Agar yeh dikh raha hai, toh aapka website setup 100% complete hai!

---

### Step 3: Google Play Console me Website URL daalein (Very Important)
Google AdMob ko kaise pata chalega ki aapki website kaun si hai?
Woh Google Play Store se aapki website link uthata hai:
1. **Google Play Console** (`play.google.com/console`) me login karein.
2. Apna App select karein.
3. Left menu me scroll karke jayein: **Store presence** ➔ **Store settings**.
4. Wahan **"Store listing contact details"** section me **Website** ka box hoga.
5. Apni website ka root domain daalein:
   - Jaise: `https://yourdomain.com` (ya `https://your-app.vercel.app`)
   - *Dhyan rahe:* Pura domain wahi hona chahiye jahan `app-ads.txt` hosted hai.
6. **Save** par click karein.

*(Agar aapka app Apple App Store par hai: App Store Connect me "Marketing URL" ya "Support URL" me apni website daalein).*

---

### Step 4: Google AdMob Console me Check karein
1. **Google AdMob Console** (`apps.admob.com`) me login karein.
2. Left sidebar me **Apps** par click karein.
3. **app-ads.txt** tab par click karein.
4. Wahan aapko aapka app dikhega:
   - Initial status ho sakta hai: *"Requires attention"* ya *"Pending"*.
   - Wahan ek button hoga: **"Check for updates"** (ya "Verify"). Us par click kar sakte hain.

---

### Step 5: 24 Hours Wait Karein (Google Automatic Crawl)
- Google ka web crawler (AdMob Bot) 24 ghante ke andar aapke Play Store URL ko visit karega aur `yourdomain.com/app-ads.txt` read kar lega.
- 24 ghante baad AdMob console me status **"Green / Authorized"** ho jayega!
- Iske baad aapki app aur website dono par Google Ads bina kisi issue ke display honge.
