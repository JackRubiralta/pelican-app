- [x] "Two SPS Debaters Qualify for Worlds" by Theo Christoffersen '26
- [x] "SPS Students Celebrate the Lunar New Year" by Edie Jones '24
- [x] "Unpacking Super Bowl Sunday 2024" by Georgia Bussey '24
- [x] "Letter from the Editors" by Danielle Choi '26
- [x] "SPS Celebrates Black History Month" by E D I T O R S I N C H I E F
- [x] "Dynamic Duos: Parker Hanson and Lulu Mangriotis" by Nel Peter '25
- [x] "A Guide to Creating Outfits for SPS Dances" by Lucas Conrod '25
- [x] "Some Favorite SPS Trails" by Helen Berger '24
- [x] "Behind the Scenes of SNL" by Kevin Wu '25
- [x] "Teacher of the Issue: Mrs. Edwards" by Kyle Gump '26
- [x] "Introducing the Knitting Club"
- [x] "Introducing Yoga Club" by Mathis Riff '27
- [x] "What is it Like Being a Teaching Fellow?" by Parker Hanson '25
- [x] "Sam 'Safety Sam' Keach"
- [x] "A Day in the Life: Two Days at Deerfield Academy" by Allegra Alfaro '25
- [x] "The Post vs. Tucker's: Concord's Breakfast Debate"
- [x] "The Guide to a Productive and Relaxing Sunday at SPS"
- [x] "What is the Best Type of Chapel Program?"
- [x] "Style Column: Mr. Snead"
- [x] "SPS Archives Column: Armour House"
- [x] "SPS Comic"
- [x] "The New Faces of SNL"
- [x] "Regrets Column: Mr. Gordon and Cole Edwards"
- [x] "Funkdefied: SPS's All-Girls Hip-Hop Dance Group"
- [x] "Theater Column: Guest Speaker Will Nunziata"

# Issue 10

```javascript
// these are articles sorted into different section from a newspaper i provided as a pdf
// What I want you to do is convert each news article title string in this object below into json format like this
// for every one make sure to copy everything exactly as in the newspaper and provide me a issue_10 file, dont leave anythibng out
// if there is not main image for an article leave it like this
 image: { // this is the main image if the article has one
          source: "", // have the source be like this with random letters
          caption: "", // copy the caption 
          show: false, // keep this default
          position: "", // keep this default
        },
// make sure to take your time and provide me a new issue_10 object i can copy, have it be an exact copy
// below is an example
{
        id: "UatDMNIHdz", // must have an id
        title: {
          text: "Making the Most of MISH", // this is the title text
          size: "medium", // this is the size keep all of them at medium for now
        },
        summary: {
          content: "", // if the title has a small summary under it add it here
          show: false, // keep this at false
        }, 
        author: "Wrenn Ragsdale", // the author
        date: "2024-02-26", // keep the date the same for all of them as they were all published on the same day
        length: 2, // make an estimate
        content: [ // here goes the content
          {
            type: "paragraph",
            text: "As the spring sun begins to thaw the remnants of winter\u2019s chill at St. Paul's, a palpable buzz of excitement and mystery envelops the campus. This phenomenon isn\u2019t just any spring fever; it\u2019s the anticipation of MISH, a mysterious yet cherished tradition woven into the fabric of the SPS community.",
          },
          {
            type: "quote",
            text: "To any new Paulie, the term MISH might initially suggest confusion or a chaotic mix. However, there's no need for concern."
          },
          {
            type: "paragraph",
            text: "To any new Paulie, the term MISH might initially suggest confusion or a chaotic mix. However, there's no need for concern. Far from being a disorganized jumble, MISH is a delightful spring celebration thoughtfully organized by our Missionary Society, which also lends its name to the event. MISH, an acronym enveloped in as much tradition as the celebration itself, signals an unexpected pause from the rigorous demands of academic and athletic pursuits during the Spring Term. It begins with an announcement by the Missionary Society\u2014a group of students dedicated to bolstering our School's community impact. This announcement sets the stage for an all-School dance, leading to a day without classes. This break provides students with a much-needed opportunity to breathe and immerse themselves in the splendor of spring.",
          },
          {
            type: "paragraph",
            text: "This unique holiday begins with rumors and guesses swirling around campus about its date, adding to the excitement and suspense. The announcement is made with the Missionary Society revealing the day and theme of the event. Last year in Chapel, Mish was announced as a glow-in-the-dark dance in Raffini Commons. When the announcement finally comes, it\u2019s a rush to prepare for the evening\u2019s festivities while managing classes and athletics that continue despite the evening\u2019s events.",
          },
          {
            type: "paragraph",
            text: "The day after the dance, the campus takes on a different character. The usual hustle and academic fervor give way to a more relaxed, festive atmosphere. Pelicans often sleep in, savoring the rare luxury of a slow morning. Many venture into Concord to dine with friends, shop, or simply enjoy the change of scenery. While some flock to the Chapel lawn, which becomes a gathering spot for those seeking to relax and relish the springtime weather, others organize trips to Boston or nearby towns to explore and take advantage of the rare opportunity to travel beyond Concord.",
          },
          {
            type: "paragraph",
            text: "For first-time MISH celebrants, my best advice is to embrace the day without overplanning. The essence of MISH lies in its spontaneity and the joy of the unexpected. Whether you\u2019re sleeping in, enjoying a leisurely brunch, spending time with friends, going to town, or just relaxing, the day is yours to enjoy in whatever way makes you happiest.",
          },
          {
            type: "image",
            source: "/images/dnjskaaSDni.jpg";
            caption: "Image of lake by Vin Mons" // copy the caption 

          },
          {
            type: "paragraph",
            text: "However, beyond the fun and festivities, MISH carries more profound significance. It\u2019s a reminder of our School's robust tradition and the importance of taking a moment to breathe amidst SPS\u2019s academic fury. Let\u2019s make the most of this day in the spirit of MISH. Let\u2019s celebrate the joy of being part of this community and the beauty of spring at SPS. Whether you\u2019re hitting the dance floor, enjoying the tranquility of the Chapel lawn, or adventuring beyond Concord, remember that MISH is about finding joy in the moment and each other.",
          },
        ],
        image: { // this is the main image if the article has one
          source: "/images/IOObHQfkEUaqRHE.jpg", // have the source be like this with random letters
          caption: "Image of school house by Vin Mons", // copy the caption 
          show: true, // keep this default
          position: "bottom", // keep this default
        },
      },
const issue_10 = {
    news: [ // these could have it own block
        "Unpacking Super Bowl Sunday 2024",
        "SPS Celebrates Black History Month",
        "SPS Students Celebrate the Lunar New Year"
    ],
    spotlight: [ // only one
        "Two SPS Debaters Qualify for Worlds"
    ]
    info: [ // tells about something: informs
        ""
    ],
    letters: [
        "Letter from the Editors",
    ],
    voices: [
        "A Day in the Life: Two Days at Deerfield Academy",
        "What is it Like Being a Teaching Fellow?",
        "Regrets Column: Mr. Gordon and Cole Edwards",

    ],
    styles: [ // its own
        "Style Column: Mr. Snead"
    ],
    people: [
        "Dynamic Duos: Parker Hanson and Lulu Mangriotis",
        "Sam 'Safety Sam' Keach",
        "Teacher of the Issue: Mrs. Edwards", // also could have its own category
    ],
    opinion: [
        "The Post vs. Tucker's: Concord's Breakfast Debate",
        "What is the Best Type of Chapel Program?",
    ],
    guides: [ // guides and tips
        "The Guide to a Productive and Relaxing Sunday at SPS",
        "A Guide to Creating Outfits for SPS Dances",
        "Some Favorite SPS Trails",
    ],
    clubs: [
        "Funkdefied: SPS's All-Girls Hip-Hop Dance Group",
        "Introducing Yoga Club",
        "Introducing the Knitting Club",
        "Behind the Scenes of SNL",
        "The New Faces of SNL",
    ]
    misc: [

    ],
    archives: [
        "SPS Archives Column: Armour House",
    ],

    theater: [
        "Theater Column: Guest Speaker Will Nunziata"
    ],
    arts: [
        "SPS Comic",
    ],
    // add some more sections / groups
}
```

```
//Required ones are:
spotlight
news
voices
guides
opinion
archives
people // have main then could have side images
letters
style
activities (/ clubs)
arts

```
