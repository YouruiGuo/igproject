valley_description_dictionary = {
  1: ["The Valley of the Quest", \
    "When you begin the Valley of the Quest <br> Misfortunes will deprive you of all rest.  \
    Renounce the world, your power, and all you own, <br> And in your heart’s blood journey on alone. \
    When love inspires his heart, he begs for wine, <br> One drop to be vouchsafed him as a sign.",
    "When you begin the Valley of the Quest / Misfortunes will deprive you of all rest.” \
    This is how Attar begins describing the first valley in the Path. \
    If you have a quest for finding your Self, your Truth, your God, your Ultimate Reality, \
    Attar suggests that “you should drop your possessions and status” and \
    be willing to leave behind everything as “you acknowledge that you don’t know anything fully."],
  2: ["The Valley of Love", \
      "Love’s valley is the next, and here desire <br> Will plunge the pilgrim into seas of fire.\
      To whom both good and evil are the same, <br> And who is neither, but a living flame. \
      Love here is fire; its thick smoke clouds the head – <br> When love has come the intellect has fled.",
      "“Love’s valley is the next, and here desire / Will plunge the pilgrim into seas of fire.” \
      This is how Attar introduces the pathfarer to the next stage in the search for ultimate reality. \
      Here, in the Valley of Love, the quest becomes a burning desire. One seeks nothing but a glimpse of the Truth. \
      Attar perceives this state as a pole star for the pathfarer all through the Way. \
      He writes: “If you could seek the unseen you would find / Love’s home, which is not reason or the mind”."],
  3: ["The Valley of Insight into Mystery", \
      "The next broad valley which the traveller sees <br> Brings insight into hidden mysteries.\
      Our insight comes to us by different signs; <br> One prays in mosques and one in idols’ shrines.\
      His essence will shine forth; the world that seemed <br> A furnace will be sweeter than he dreamed.",
      "“Thereafter, it will be portrayed before your mind, insightfulness, the pathless path”. \
      Attar describes the next Valley as a paradox. As one exchanges the analytical mind for Love, \
      one acquires insights about the unseen Ultimate Reality. Attar acknowledges different approaches to Truth: \
      “Our insight comes to us by different signs; / One prays in mosques and one in idols’ shrines.”"],
  4: ["The Valley of Detachment", \
      "Next comes the Valley of Detachment; here <br> All claims, all lust for meaning disappear.\
      The seven planets seem a fading spark, <br> The seven seas a pool...\
      The seven planets seem a fading spark, <br> The seven seas a pool, and heaven’s arc <br> Is more like dust and death than paradise.",
      "“Next comes the Valley of Detachment; here / All claims, all lust for meaning disappear.”  \
      Attar portrays this Valley using a chain of complex ideas, highlighting our inability to comprehend the meanings of our lives, \
      the presence of paradoxes in our minds, and in existence. Attar brilliantly chains famous stories, one verse each, \
      as examples of those crucial moments when events take unexpected turns. \
      This is the valley where Truth is acknowledged as being outside logical reality."],
  5: ["The Valley of Unity",\
      "Next comes the Valley of pure Unity, <br> place of lonely, long austerity,\
      And all who enter on this waste have found <br> Their various necks by one tight collar bound.\
      All talk of two implies plurality – <br> When two has gone there will be Unity. \
      Lose yourself in Him; this is tohid, unity <br> Lose your loss, this is tafrid, unification",
      "“Next comes the Valley of pure Unity, / place of lonely, long austerity.” \
      Here is the world of undissected reality, that can only be realized as One. \
      This realization, Attar believes, eventually leads to the acknowledgment of the world as a mere complexity of forms. \
      He tells different stories in this Valley to highlight his realization of this stage along the Path… \
      “Once someone asked a dervish to portray / The nature of this world in which we stray. \
      He said: ‘This various world is like a toy – / A coloured palm-tree given to a boy,’”... \
      “All things are one – there isn’t any two; / It isn’t me who speaks; it isn’t you.”",],
  6: ["The Valley of Bewilderment", \
      "Next comes the Valley of Bewilderment, <br> A place of pain and gnawing discontent – \
      ...here I cannot find <br> That rope by which men live, the rational mind \
      Once in the Valley of Bewilderment <br> The pilgrim suffers endless discontent.",
      "“The Unity you knew has gone; your soul Is scattered and knows nothing of the Whole.” \
      After uniting with Truth, Attar recognizes a stage of confusion. “Arriving in this valley, the bewildered one loses the way, \
      the influence of Unity on the soul, and even the idea of “loss”.... He says: “I do not know a thing, nor do I know my not knowing.” \
      Later, reflecting on the story of a woman who weeps bewilderedly on her daughter’s grave, \
      Attar says: “And yet it is to see within the soul – And at a stroke – the meaning of the Whole.”"],
  7: ["The Valley of Poverty and Nothingness", \
      "Next comes that valley words cannot express, <br> The Vale of Poverty and Nothingness.\
      And in self-loss obtains eternal rest; <br> The heart that would be lost in this wide sea\
      And in self-loss obtains eternal rest; <br> The heart that would be lost in this wide sea \
      Disperses in profound tranquility.", \
      "“Next comes that valley words cannot express, The Vale of Poverty and Nothingness.” \
      Attar describes this valley as the state in which the pathfarer finally sinks into the realm of eternity. \
      Here, “He is not, yet he is; what could this mean? / It is a state the mind has never seen.” \
      “First lose yourself, then lose this loss and then Withdraw from all that you have lost again – \
      Go peacefully, and stage by stage progress Until you gain the realms of Nothingness; \
      But if you cling to any worldly trace, No news will reach you from that promised place.”"]
}

function loadDescription(user_position){
  pop = document.querySelector('.popdesc');
  pop.innerHTML = "";
  var valley = valley_description_dictionary[user_position];
  var title = valley[0];
  var poetry = valley[1];
  var desc = valley[2];
  var block = document.createElement('div');

  var title_div = document.createElement('div');
  title_div.setAttribute("style", "text-align:center;");
  title_p = document.createElement('p');
  title_p.innerHTML = title;
  title_div.append(title_p);
  block.append(title_div);

  var poetry_div = document.createElement('div');
  poetry_div.setAttribute("style", "padding-left: 0.5em;");
  poetry_p = document.createElement('p');
  poetry_p.innerHTML = poetry;
  poetry_div.append(poetry_p);
  block.append(poetry_div);

  var desc_div = document.createElement('div');
  desc_div.setAttribute("style", "padding-left: 0.5em;");
  desc_p = document.createElement('p');
  desc_p.innerHTML = desc;
  desc_div.append(desc_p);
  block.append(desc_div);

  pop.append(block);
}
