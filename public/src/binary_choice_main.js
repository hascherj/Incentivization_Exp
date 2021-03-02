//////////////
/** To Do **/
/////////////


//////////////////
/** Reminders **/
/////////////////
//turn on all timeline
//put right conditions
//turn off testing parameters (rating free advance)
//right number of trials


/////////////////
/** Constants **/
/////////////////
const ntrials = 200; //200 trials 
const npractice = 3; //3
const do_practice = 0; //to test code
const fixation_duration = 500; //half sec
const nRatings = 80; //number of ratings (max 80)

//date constants
var TODAY = new Date();
var DD = String(TODAY.getDate()).padStart(2, "0");
var MM = String(TODAY.getMonth() + 1).padStart(2, "0");
var YYYY = TODAY.getFullYear();
const DATE = MM + DD + YYYY;

/////////////
/** Setup */
////////////

var successExp = false
var status_code = null;

downloadCSV = function (csv, filename) {
  var csvFile;
  var downloadLink;

  csvFile = new Blob([csv], { type: "text/csv" });
  downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
};

function makeSurveyCode(status) {
  var suffix = {
    'bad_ratings': 'R1',
    'pass_all': 'P5'
  }[status]
  return `${subject_id}${suffix}`;
}


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function repeatArray(arr, count) {
  var ln = arr.length;
  var b = new Array();
  for (i = 0; i < count; i++) {
    b.push(arr[i % ln]);
  }
  return b;
}

function roundToNearest(x, nearest) {
  return (Math.round(x * nearest) / nearest).toFixed(2);
}//for nearst cent = 100; for nearest quarter = 4

function arrayToList_Healthy(array) {
  let list = [];
  for (let i = 0; i <= array.length - 1; i++) {
    list.push({ stimulus: array[i], food_type: "healthy" });
  }
  return list;
}

function arrayToList_Unhealthy(array) {
  let list = [];
  for (let i = 0; i <= array.length - 1; i++) {
    list.push({ stimulus: array[i], food_type: "unhealthy" });
  }
  return list;
}

function arrayToList(array) {
  let list = [];
  for (let i = 0; i <= array.length - 1; i++) {
    list.push({ stimulus: array[i] });
  }
  return list;
}


var initial_pref = function () {

  let healthy_first = [];
  let healthy_rating_total = 0;
  let unhealthy_rating_total = 0;

  healthy_good.forEach(function (item) {
    healthy_rating_total += item.rating;
  })

  unhealthy_good.forEach(function (item) {
    unhealthy_rating_total += item.rating;
  })

  if (healthy_rating_total / healthy_good.length > unhealthy_rating_total / unhealthy_good.length) {
    healthy_first = 1;
  } else {
    healthy_first = 0;
  }
  return healthy_first;
}


var get_choice_pairs = function (array) {
  let combos = [];
  //Create list of all possible pairs
  for (var i = 0; i < array.length - 1; i++) {
    for (var j = i + 1; j < array.length; j++) {
      combos.push({ stimulus1: array[i].stimulus, stimulus1_rating: array[i].rating, stimulus2: array[j].stimulus, stimulus2_rating: array[j].rating });
    }
  }
  //Shuffle the pairs
  let list = combos.slice();
  for (var i = list.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = list[i];
    list[i] = list[j];
    list[j] = temp;
  }
  return list
}

//Comment this part out
/*
var get_pairs = function (array1, array2) {
  let list = [];
  let list_better = [];
  let list_worse = [];
  let list_final = [];

  for (var i = 0; i < array1.length; i++) {
    for (var j = 0; j < array2.length; j++) {
      list.push({ stimulus1: array1[i].stimulus, stimulus1_food_type: array1[i].food_type, stimulus1_rating: array1[i].rating, stimulus2: array2[j].stimulus, stimulus2_food_type: array2[j].food_type, stimulus2_rating: array2[j].rating, rating_diff: array1[i].rating - array2[j].rating });
    }
  }

  list_better = list.filter(function (element) { return element.rating_diff >= 1; });
  list_worse = list.filter(function (element) { return element.rating_diff >= -1; });

  list_final = [...jsPsych.randomization.sampleWithoutReplacement(list_better, 113), ...jsPsych.randomization.sampleWithoutReplacement(list_worse, 37)];

  return list_final
}
*/
//Down until here


var get_practice_pairs = function (array) {
  let list_final = [];
  list_final.push({ stimulus1: array[0], stimulus1_rating: 0, stimulus2: array[1], stimulus2_rating: 0, rating_diff: 0 });
  list_final.push({ stimulus1: array[2], stimulus1_rating: 0, stimulus2: array[3], stimulus2_rating: 0, rating_diff: 0 });
  list_final.push({ stimulus1: array[4], stimulus1_rating: 0, stimulus2: array[5], stimulus2_rating: 0, rating_diff: 0 });
  return list_final
}

//Comment this out 
/*
var get_practice_pairs = function (array) {
  let list_final = [];
  list_final.push({ stimulus1: array[0], stimulus1_food_type: "healthy", stimulus1_rating: 0, stimulus2: array[1], stimulus2_food_type: "unhealthy", stimulus2_rating: 0, rating_diff: 0 });
  list_final.push({ stimulus1: array[2], stimulus1_food_type: "healthy", stimulus1_rating: 0, stimulus2: array[3], stimulus2_food_type: "unhealthy", stimulus2_rating: 0, rating_diff: 0 });
  list_final.push({ stimulus1: array[4], stimulus1_food_type: "healthy", stimulus1_rating: 0, stimulus2: array[5], stimulus2_food_type: "unhealthy", stimulus2_rating: 0, rating_diff: 0 });
  return list_final
} 
*/
//Down to here


///////////////////////////////
/** Set Subject Parameters **/
//////////////////////////////
var subject_id = jsPsych.randomization.randomID(7);

var experiment_code = 'fc5_';
subject_id = experiment_code + subject_id;

// left vs right
var healthy_side = jsPsych.randomization.sampleWithoutReplacement([1, 2], 1);
//var healthy_side = 2;

var healthy_first = jsPsych.randomization.sampleWithoutReplacement([0, 1], 1);

/////////////////////////
/** Add Subject Info **/
////////////////////////
var RatingConds = ["BR", "WTP", "FP"];
var RatingCondition = RatingConds[Math.floor(Math.random() * RatingConds.length)];

jsPsych.data.addProperties({
  subject: subject_id,
  date: DATE,
  subid_date: subject_id + DATE,
  condition: RatingCondition,
});

//////////////////////
/** Import Images **/
/////////////////////

var practice_images = [];
for (var i = 0; i <= npractice * 2 - 1; i++) {
  practice_images.push('../img/practice/practice' + i + '.JPG');
};
var practice_trials = get_practice_pairs(practice_images);
console.log(practice_trials);
/*
var healthy_stimuli_array = [];
for (var i = 0; i <= 47; i++) {
  healthy_stimuli_array.push('../img/stimuli/healthy/healthy' + i + '.JPG');
};


var unhealthy_stimuli_array = [];
for (var i = 0; i <= 52; i++) {
  unhealthy_stimuli_array.push('../img/stimuli/unhealthy/unhealthy' + i + '.JPG');
};


var healthy_stimuli_list = arrayToList_Healthy(healthy_stimuli_array);
var unhealthy_stimuli_list = arrayToList_Unhealthy(unhealthy_stimuli_array);
*/

//Stimuli for Josh

var stimuli_array = [];
for (var i = 1; i <= nRatings; i++) {
  stimuli_array.push('../img/foodstim/food' + i + '.jpg');
};
var stimuli_list = arrayToList(stimuli_array);

/***********************/
/******** Survey *******/
/***********************/
var start_exp_survey_trial = {
  type: 'survey-text',
  questions: [
    { prompt: "What's your worker ID?", rows: 2, columns: 50, required: true },
    { prompt: "What's your age?", rows: 1, columns: 50, required: true },
    { prompt: "What's your gender?", rows: 1, columns: 50, require: true },
  ],
  preamble: `<div>Thanks for choosing our study! Please answer the following questions to begin today's study. </div>`
};

//////////////////
/** Experiment */
/////////////////

/** full screen */
var fullscreen = {
  type: 'fullscreen',
  message: `<div> Before we begin, please close any unnecessary programs or applications on your computer.  
  This will help the study run more smoothly.    
  <br><br/>
   Also, please close any browser tabs that could produce pop-ups or alerts that would interfere with the study.
   <br><br/>
   Finally, once the study has started, <b>DO NOT EXIT</b> fullscreen mode or you will terminate the study and not receive any payment.
  <br><br/>
  The study will switch to full screen mode when you press the button below.
  <br><br/>
  When you are ready to begin, press the button.
  <br><br/></div>`,
  fullscreen_mode: true,
  //on_finish: function () {
  //  document.body.style.cursor = 'none'
  //}
};

/** introduction */
var instructions_Welcome = {
  data: {
    screen_id: "welcome"
  },
  type: 'instructions',
  pages: ["In this study, you will be making a series of decisions about foods. At the end of the study you may be randomly<br/>" +
    "selected to receive a shipment of food based on one of your choices. One in ten participants will be selected.<br/><br/>" +
    "There will be multiple parts to the study, and you will receive instructions before each new part.<br/><br/> " +
    "Please press the spacebar to continue."],
  allow_backward: false,
  key_forward: 'spacebar'
};

///////////////
/** Ratings */
//////////////


if (RatingCondition == "BR") {
  var instructions_Ratings = {
    data: {
      screen_id: "instructions_ratings_BR"
    },
    type: "instructions",
    pages: ["First, you will make decisions about a series of foods one by one.<br/>" +
      "Then, in the second part of the study, you will be making choices between pairs of foods.<br/>At the end of the study " +
      "you may receive a food based on your choices from the second part of the study, selected at random.<br/>" +
      "Therefore, it is therefore important to try to be as accurate as possible throughout the entire study.<br/>" +
      "Press the spacebar to continue.",

    "We are asking you to rate each food based on how much you would like to eat it.<br/><br/>" +
    "Rate each food on a scale from 0 to 4.<br/><br/>" +
    "4 means that you would really like to eat it<br/>" +
    "0 means you would neither like nor dislike to eat it.<br/>" +
    'If you would not want to eat it, then click the "Would Not Eat" button.',

    "Use the mouse to click on the scale to indicate your rating.<br/>" +
    "You will automatically progress to the next food.<br/><br/>" +
    "Press the spacebar when you are ready to begin.",
    ],
    allow_backward: false,
    key_forward: 'spacebar'
  }
} else if (RatingCondition == "WTP") {
  var instructions_Ratings = {
    data: {
      screen_id: "instructions_ratings_WTP"
    },
    type: "instructions",
    pages: ["First, you will make decisions about a series of foods one by one.<br/>" +
      "Then, in the second part of the study, you will be making choices between pairs of foods.<br/>At the end of the study " +
      "you may receive a food based on one of your choices in the study, selected at random.<br/>" +
      "Therefore, it is important to try to be as accurate as possible throughout the entire study.<br/>" +
      "Press the spacebar to continue.",

    "We are asking you to report how much you would be willing to pay to receive each food, in the form of a bid.<br/><br/>" +
    "Indicate your bid for each food on a scale from $0 to $4, or click the 'Would Not Eat' button. If this task is randomly selected to determine</br>" +
    "your reward, ONE of the foods will be randomly selected, along with a random price from $0 to $4 in $0.01 increments.<br/>" +
    "Press the spacebar to continue.",

    "If your bid is greater than or equal to the random price, you will get the food for that price.</br>" +
    "If your bid is less than the random price, you will NOT get the food, and will not have to pay anything.</br>" +
    "These rules ensure that it is in your best interest to bid your true willingness to pay for each food,</br>" +
    "since you can’t affect the price of the food, you can only decide what prices are acceptable to you.</br>" +
    "Press the spacebar to continue.",

    "Use the mouse to click on the scale to indicate your rating.<br/>" +
    "You will automatically progress to the next food.<br/><br/>" +
    "Press the spacebar when you are ready to begin.",
    ],
    allow_backward: false,
    key_forward: 'spacebar'
  }
} else if (RatingCondition == "FP") {
  var instructions_Ratings = {
    data: {
      screen_id: "instructions_ratings_FP"
    },
    type: "instructions",
    pages: ["First, you will make decisions about a series of foods one by one.<br/>" +
      "Then, in the second part of the study, you will be making choices between pairs of foods.<br/>At the end of the study " +
      "you may receive a food based on one of your choices in the study, selected at random.<br/>" +
      "Therefore, it is important to try to be as accurate as possible throughout the entire study.<br/>" +
      "Press the spacebar to continue.",

    "We are asking you to rate each food based on how much you would like to receive it.<br/><br/>" +
    "Rate each food on a scale from 0 to 4.<br/><br/>" +
    "4 means that you would really like to eat it<br/>" +
    "0 means you would neither like nor dislike to eat it.<br/>" +
    'If you would not want to eat it, then click the "Would Not Eat" button.',

    "If this task is randomly selected to determine your reward, a random pair of these foods</br>" +
    "will be selected and you will receive the food that you rated higher.  If there is a tie, one</br>" +
    'of the foods will be chosen at random. If you selected “Would Not Eat” for both foods, you will not receive any food.',

    "Use the mouse to click on the scale to indicate your rating.<br/>" +
    "You will automatically progress to the next food.<br/><br/>" +
    "Press the spacebar when you are ready to begin.",
    ],
    allow_backward: false,
    key_forward: 'spacebar'
  }
}

/*
var instructions_Ratings = {
  data: {
    screen_id: "instructions_ratings"
  },
  type: "instructions",
  pages: ["First, you will make decisions about a series of foods one by one.<br/><br/>" +
    "We are asking you to rate each food based on how much you would like to eat the food right now.<br/><br/>" +
    "Rate each food on a scale from 0 to 4.<br/><br/>" +
    "10 means that you would really like to eat it<br/>" +
    "0 means you would neither like nor dislike to eat it.<br/>" +
    'If you would not want to eat it, then click the "Would Not Eat" button.<br/><br/>' +
    "Use the mouse to click on the scale to indicate your rating.  " +
    "You will automatically progress to the next food.<br/><br/>" +
    "Press the spacebar when you are ready to begin.",
  ],
  allow_backward: false,
  key_forward: 'spacebar'
}
*/

//var foods_to_rate =  [...healthy_stimuli_list, ...unhealthy_stimuli_list];
var foods_to_rate = [...stimuli_list];
var rating_order = jsPsych.randomization.shuffle(Array.from(Array(foods_to_rate.length).keys()));

var foods_good = [];
if (do_practice == 1) {
  for (var i = 0; i < foods_to_rate.length; i++) {
    RandomRating = Math.random() * 4;
    foods_good.push(foods_to_rate[i]);
    foods_good[foods_good.length - 1].rating = RandomRating;
  }
};
var healthy_good = [];
var unhealthy_good = [];

var negative_rating_counter_healthy = 0;
var negative_rating_counter_unhealthy = 0;
var negative_rating_counter = 0;
var rating_counter = 0;
var ratings_good = 1;


var ratings = {
  timeline: [
    {
      type: "rating-scale",
      stimulus: () => foods_to_rate[rating_order[rating_counter]].stimulus,
      labels: ['0', '1', '2', '3', '4'],
      min: 0,
      max: 4,
      step: .01,
      stimulus_height: 300,
      stimulus_width: 400,
      start: () => getRandomFloat(0, 4),
      require_movement: true,
      slider_width: 750,
      response_ends_trial: true,
      on_start: function () {
        //console.log(rating_counter+1);
        //console.log(rating_order[rating_counter+1]);
      },
      on_finish: (data) => {
        if (data.rating >= 0){
        foods_good.push(foods_to_rate[rating_order[rating_counter]]);
        foods_good[foods_good.length - 1].rating = data.rating;
      };
        //Comment this part out
        /*
        if (foods_to_rate[rating_order[rating_counter]].food_type == "healthy") {
          healthy_good.push(foods_to_rate[rating_order[rating_counter]]);
          healthy_good[healthy_good.length - 1].rating = data.rating;
        } else if (foods_to_rate[rating_order[rating_counter]].food_type == "unhealthy") {
          unhealthy_good.push(foods_to_rate[rating_order[rating_counter]]);
          unhealthy_good[unhealthy_good.length - 1].rating = data.rating;
        };
        */
        //Down to here

        //this part is to keep track of scrub participants
        if (data.rating < 0) {
          negative_rating_counter++;
          console.log(negative_rating_counter);
        };

        if (negative_rating_counter > 59) { //They need to make at least 21 positive ratings to generate 200 distinct choice trials
          //closeFullscreen();
          //survey_code = makeSurveyCode('bad_ratings');
          //jsPsych.endExperiment(endofExp(survey_code));
          ratings_good = 0;
        };
        //Comment this part out
        /*
        if (data.rating < 0 && foods_to_rate[rating_order[rating_counter]].food_type == "healthy") {
          negative_rating_counter_healthy++;
          console.log(negative_rating_counter_healthy);
        };
        if (data.rating < 0 && foods_to_rate[rating_order[rating_counter]].food_type == "unhealthy") {
          negative_rating_counter_unhealthy++;
          console.log(negative_rating_counter_unhealthy);
        };
        if (negative_rating_counter_healthy > 30 || negative_rating_counter_unhealthy > 35) {
          closeFullscreen();
          survey_code = makeSurveyCode('bad_ratings');
          jsPsych.endExperiment(endofExp(survey_code));
        };
        */
        //Down to here



        rating_counter++;
      }
    }
  ],
  loop_function: () => rating_counter < foods_to_rate.length
};



///////////////
/** Trials */
//////////////

var healthy_better_pairs;
var unhealthy_better_pairs;
var trials_phase1;
var trials_phase2;
var choice_trials;

//For Josh
var instructions_trials = {
  type: 'html-keyboard-response',
  stimulus: `<div><font size=120%; font color = 'green';></font><br/>
                                        <br><br/>
            In this part of the study, you will see two foods on the screen. <br/>    
            You have to choose which food you would prefer to eat. <br/>   
            To select the left food, press the <b><font color='green'>F</font></b> key. <br/>
            To select the right food, press the <b><font color='green'>J</font></b> key. <br/>
            After each choice, stare at the white cross at the center of the screen.  <br/>
            <br><br/>
            When you are ready, press the spacebar to begin with a couple of practice rounds. </div>`,
  choices: ['spacebar'],
  post_trial_gap: 500,
  on_finish: function () {
    choice_trials = get_choice_pairs(foods_good);
  }
}


//Comment this part out
/*
var instructions_trials = {
  type: 'html-keyboard-response',
  stimulus: `<div><font size=120%; font color = 'green';></font><br/>
                                        <br><br/>
            In this part of the study, you will see two foods on the screen, one which is considered healthy and one which is considered unhealthy. <br/>    
            You have to choose which food you would prefer to eat. <br/>   
            To select the left food, press the <b><font color='green'>F</font></b> key. <br/>
            To select the right food, press the <b><font color='green'>J</font></b> key. <br/>
            After each choice, stare at the white cross at the center of the screen.  <br/>
            <br><br/>
            When you are ready, press the spacebar to begin with a couple of practice rounds. </div>`,
  choices: ['spacebar'],
  post_trial_gap: 500,
  on_finish: function () {
    healthy_better_trials = get_pairs(healthy_good, unhealthy_good);
    unhealthy_better_trials = get_pairs(unhealthy_good, healthy_good);
    //healthy_first = initial_pref(healthy_good, unhealthy_good);
    //console.log(healthy_first);
    if (healthy_first == 1) {
      trials_phase1 = healthy_better_trials;
      trials_phase2 = unhealthy_better_trials;
    } else {
      trials_phase1 = unhealthy_better_trials;
      trials_phase2 = healthy_better_trials;
    };
    console.log(healthy_better_trials);
    console.log(unhealthy_better_trials);
    console.log(trials_phase1);
    console.log(trials_phase2);
  }
}
*/
//Until Here


///////////////
/** Practice */
//////////////

var fixation = {
  type: 'html-keyboard-response',
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: fixation_duration,
};

var practice_count = 0;
var practice_choices = {
  timeline: [
    fixation,
    {
      type: "binary-food-choice",
      stimulus: () => practice_trials[practice_count],
      trial_number: () => practice_count + 1,
      timing_response: 0,
      data: { choice_type: 'practice' },
      on_start: function () {
        document.body.style.cursor = 'none';
      },
      on_finish: () => practice_count++
    }
  ],
  loop_function: () => practice_count < npractice
};

///////////////////
/** Real Trials */
//////////////////

if (healthy_first == 1) {
  var instructions_shop1 = ["In this shop, the healthy foods are generally better than the unhealthy foods.<br/><br/>"];
} else if (healthy_first == 0) {
  var instructions_shop1 = ["In this shop, the unhealthy foods are generally better than the healthy foods.<br/><br/>"];
}


if (healthy_side == 1) {
  var instructions_side = ["The healthy food will always be one the left, and the unhealthy food will always be on the right.<br/><br/>"];
} else if (healthy_side == 2) {
  var instructions_side = ["The unhealthy food will always be on the left, and the healthy food will always be on the right.<br/><br/>"];
}


var instructions_phase1 = {
  data: {
    screen_id: "instructions_phase1"
  },
  type: "instructions",
  pages: ["Now you can move on to the real choices.<br/><br/>" +
    "Imagine that you are in a shop and you are choosing between the two foods presented to you.  " +
    [instructions_shop1] +
    [instructions_side] +
    "Please press the spacebar to continue to the choices."
  ],
  allow_backward: false,
  key_forward: 'spacebar'
}


if (RatingCondition == "BR") {
  var instructions_choices = {
    data: {
      screen_id: "instructions_choices_BR"
    },
    type: "instructions",
    pages: ["Now you can move on to the real choices.<br/><br/>" +
      "Imagine that you are in a shop and you are choosing between the two foods presented to you.<br/>" +
      "Remember, the food you choose in one of the rounds may be shipped to you after the study.<br/><br/>" +
      "Press the spacebar to continue to the choices."
    ],
    allow_backward: false,
    key_forward: 'spacebar'
  }
} else if (RatingCondition == "WTP") {
  var instructions_choices = {
    data: {
      screen_id: "instructions_choices_WTP"
    },
    type: "instructions",
    pages: ["Now you can move on to the real choices.<br/><br/>" +
      "Imagine that you are in a shop and you are choosing between the two foods presented to you.<br/>" +
      "Remember, the food you choose in one of the rounds may be shipped to you after the study.<br/><br/>" +
      "Press the spacebar to continue to the choices."
    ],
    allow_backward: false,
    key_forward: 'spacebar'
  }
} else if (RatingCondition == "FP") {
  var instructions_choices = {
    data: {
      screen_id: "instructions_choices_FP"
    },
    type: "instructions",
    pages: ["Now you can move on to the real choices.<br/><br/>" +
      "Imagine that you are in a shop and you are choosing between the two foods presented to you.<br/>" +
      "Remember, the food you choose in one of the rounds may be shipped to you after the study.<br/><br/>" +
      "Press the spacebar to continue to the choices."
    ],
    allow_backward: false,
    key_forward: 'spacebar'
  }
}



var halfway_break = {
  type: 'html-keyboard-response',
  stimulus: `<div>You may take a short break if you want.
             <br></br>
             When you are ready to continue the study, press the spacebar.</div>`,
  choices: ['spacebar'],
  post_trial_gap: 500
}

var break_node = {
  timeline: [halfway_break],
  conditional_function: function () {
    return (choice_count % 100 == 0 && choice_count != 0);
  }
}



////////////////
/** Phase 1 */
////////////////


/*
var choice_count_phase1 = 0;
var trials_order_phase1 = jsPsych.randomization.shuffle(Array.from(Array(ntrials).keys()));

var choice_phase1 = {
  timeline: [
    break_node,
    fixation,
    {
      type: "binary-food",
      stimulus: () => trials_phase1[trials_order_phase1[choice_count_phase1]],
      trial_number: () => choice_count_phase1 + 1,
      timing_response: 0,
      healthy_side: healthy_side,
      data: { choice_type: 'phase1' },
      on_start: function () {
        //console.log(trials_phase1[trials_order_phase1[choice_count_phase1]]);
      },
      on_finish: () => {
        choice_count_phase1++;
      }
    }
  ],
  loop_function: () => choice_count_phase1 < ntrials
};
*/
/////////////
/** Phase 2 */
////////////

/*
//Comment this out

if (healthy_first == 1) {
  var instructions_shop2 = ["But in this shop, the unhealthy foods are generally more highly rated than the unhealthy foods.<br/><br/>"];
} else if (healthy_first == 0) {
  var instructions_shop2 = ["But in this shop, the healthy foods are generally more highly rated than the unhealthy foods.<br/><br/>"];
}

var instructions_phase2 = {
  data: {
    screen_id: "instructions_phase1"
  },
  type: "instructions",
  pages: ["Now, imagine that you are now in a new shop.  Again, you are choosing between the two foods on the screen.  " +
    [instructions_shop2] +
    [instructions_side] +
    "Please press the spacebar to continue to the choices."
  ],
  allow_backward: false,
  key_forward: 'spacebar'
}

var trials_order_phase2 = jsPsych.randomization.shuffle(Array.from(Array(ntrials).keys()));
var choice_count_phase2 = 0;
var choice_phase2 = {
  timeline: [
    break_node,
    fixation,
    {
      type: "binary-food",
      stimulus: () => trials_phase2[trials_order_phase2[choice_count_phase2]],
      trial_number: () => choice_count_phase2 + 1,
      timing_response: 0,
      healthy_side: healthy_side,
      data: { choice_type: 'phase2' },
      on_start: function () {
        console.log(trials_phase2[trials_order_phase2[choice_count_phase2 + 1]]);
      },
      on_finish: () => {
        choice_count_phase2++;
      }
    }
  ],
  loop_function: () => choice_count_phase2 < ntrials
};

*/
//Down to here

//For Josh
var trials_order = jsPsych.randomization.shuffle(Array.from(Array(ntrials).keys()));
var choice_count = 0;
var choices = {
  timeline: [
    break_node,
    fixation,
    {
      type: "binary-food-choice",
      stimulus: () => choice_trials[trials_order[choice_count]],
      trial_number: () => choice_count + 1,
      timing_response: 0,
      on_finish: () => {
        choice_count++
      }
    }
  ],
  loop_function: () => choice_count < ntrials
}


// REWARDS
var reward_trial = {
  reward_chosen: 0,
  choice_type: "",
  trial_number: "",
  food_reward: ""
}


if (RatingCondition == "FP" || RatingCondition == "WTP") {
  if (Math.random < 0.5) {
    var rewardTask = "choice";
  } else {
    var rewardTask = "rating";
  }
} else if (RatingCondition == "BR") {
  var rewardTask = "choice";
};

var post_choices = {
  type: "html-keyboard-response",
  stimulus: "<div id = 'type'> A random </div> round was drawn to determine your reward.<br/>" +
    "Press the spacebar to find out your reward.",
  choices: [32], //spacebar
  on_load: function rewardType() {
    document.getElementById('type').textContent += rewardTask;
  },
  on_start: function (data) {
    if (rewardTask == "choice") {
      window.rewardData = jsPsych.data.get().filter({ trial_type: 'binary-food-choice' }).values(); //Pull all the choices
      window.rewardObj = jsPsych.randomization.sampleWithoutReplacement(rewardData, 1)[0]; //Select a random choice trial
      if (parseFloat(rewardObj.stimulus.stimulus1_rating) > parseFloat(rewardObj.stimulus.stimulus2_rating)) {
        window.foodReward = rewardObj.stimulus.stimulus1; //Gives string of food #
      } else {
        window.foodReward = rewardObj.stimulus.stimulus2;
      }
    } else if (rewardTask == "rating") {
      window.rewardData = jsPsych.data.get().filter({ trial_type: 'rating-scale' }).values(); //Pull all the rating trials
      if (RatingCondition == "FP") {
        window.rewardObj = jsPsych.randomization.sampleWithoutReplacement(rewardData, 2); //Select 2 random rating trials
       if (parseFloat(rewardObj[0].rating) > parseFloat(rewardObj[1].rating)) {
            window.foodReward = rewardObj[0].stimulus;
       } else if(parseFloat(rewardObj[0].rating) < parseFloat(rewardObj[1].rating)) {
            window.foodReward = rewardObj[1].stimulus;
        } else {
          window.foodReward = rewardObj[Math.floor(Math.random()*2)].stimulus; //if they're both equal, choose one at random
        }
      } else if (RatingCondition == "WTP") {
        window.rewardObj = jsPsych.randomization.sampleWithoutReplacement(rewardData, 1)[0]; //Select a random rating trial
        window.auctionVal = Math.random()*4.01; //Returns random number in [0,4.01)
        window.buyDiff = parseFloat(rewardObj.rating) - auctionVal;
        window.foodReward = rewardObj.stimulus;
        if (buyDiff >= 0) {
          window.buy = true;
        } else {
          window.buy = false;
        }
      }
    }
  }
}

var choiceRewardScreen = { //If their choices determine their reward
  type: "html-keyboard-response",
    stimulus: "The following food was chosen by you in a random round, and will be your reward for this experiment:" +
              "<div style = 'float: center;'>" +
              "<img id = 'img' style = 'width: 350px; height: 350px;'></img></div>" +
      "Press the spacebar to continue.",
      on_load: function rewardType() {
        document.getElementById('img').src += foodReward;
      },
    choices: [32], //spacebar
    on_finish: function reward() {
      jsPsych.data.addProperties({rewardType: "food", reward: foodReward})
    }
}
var choiceReward = {
  timeline: [choiceRewardScreen],
  conditional_function: function () {
    if (rewardTask == "choice") {
      return true;
    } else {
      return false;
    }
  }
}

var fpRewardScreen = {
  type: "html-keyboard-response",
    stimulus: "Two random foods were selected, and the following food was rated higher. Thus, it will be your reward for this experiment:" +
              "<div style = 'float: center;'>" +
              "<img id = 'img' style = 'width: 350px; height: 350px;'></img></div>" +
      "Press the spacebar to continue.",
      on_load: function rewardType() {
        document.getElementById('img').src += foodReward;
      },
    choices: [32], //spacebar
    on_finish: function reward() {
      jsPsych.data.addProperties({rewardType: "food", reward: foodReward})
    }
}
var fpReward = {
  timeline: [fpRewardScreen],
  conditional_function: function () {
    if (rewardTask == "rating" && RatingCondition == "FP") {
      return true;
    } else {
      return false;
    }
  }
}

var wtpRewardScreen = { //If their WTP for a random food determines thier reward
type: "html-keyboard-response",
    stimulus: "<div id = price> The following food was randomly chosen to be auctioned off at a random price of $</div>" +
              "<div id = wtp>Your reported willingness to pay for this food was:</div>" +
              "<div id = buy>Therefore, you will </div>" +
              "<div style = 'float: center;'>" +
              "<img id = 'img' style = 'width: 350px; height: 350px;'></img></div>" +
      "Press the spacebar to continue.",
      on_load: function rewardType() {
        document.getElementById('price').textContent += (Math.round(auctionVal*100)/100).toString();
        document.getElementById('wtp').textContent += rewardObj.rating;
        document.getElementById('img').src += foodReward;
        window.moneyReward = (Math.round(buyDiff*100)/100).toString();
        if(buy == true) {
          document.getElementById('buy').textContent += "buy the item at that price and receive the $" + moneyReward + " leftover from your $4 budget.";
        } else {
          document.getElementById('buy').textContent += "not buy the item and keep the entirety of your $4 budget.";
        }
      },
    choices: [32], //spacebar
    on_finish: function reward() {
      jsPsych.data.addProperties({rewardType: "money", reward: moneyReward})
    }
    }
var wtpReward = {
  timeline: [wtpRewardScreen],
  conditional_function: function () {
    if (rewardTask == "rating" && RatingCondition == "WTP") {
      return true;
    } else {
      return false;
    }
  }
}


////////////////////////
/** End of Experiment */
///////////////////////
var success_check = {
  type: 'call-function',
  func: () => { successExp = true }
}

var endofExp = function (survey_code) {
  html = `Thank you for participating! You can now close this screen.
    </div>`;
  return html
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
}

var on_close_callback = function () {
  // jsPsych.data.displayData();
  jsPsych.data.addProperties({
    interaction: jsPsych.data.getInteractionData().json(),
    windowWidth: screen.width,
    windowHight: screen.height
  });
  var data = JSON.stringify(jsPsych.data.get().values());
  $.ajax({
    type: "POST",
    url: "/experiment-data",
    data: data,
    contentType: "application/json"
  })
    .done(function () {
      alert("Your data has been saved.");
    })
    .fail(function () {
      //alert("Problem occured while writing data to Dropbox.  Please contact the experimenter.");
      //var csv = jsPsych.data.get().csv();
      //var filename = "charity_data.csv";
      //downloadCSV(csv, filename);
    })
}


var on_finish_callback = function () {
  // jsPsych.data.displayData();
  jsPsych.data.addProperties({
    interaction: jsPsych.data.getInteractionData().json(),
    windowWidth: screen.width,
    windowHight: screen.height,
  });
  var data = JSON.stringify(jsPsych.data.get().values());
  $.ajax({
    type: "POST",
    url: "/experiment-data",
    data: data,
    contentType: "application/json"
  })
    .done(function () {
      alert("Your data has been saved.");
    })
    .fail(function () {
      //alert("Problem occured while writing data to Dropbox.  Please contact the experimenter.");
      //var csv = jsPsych.data.get().csv();
      //var filename = "charity_data.csv";
      //downloadCSV(csv, filename);
    })
}

var trialcounter;
var get_food_random_chance  = 10;
var demographic_survey = {
  type: 'survey-text',
  on_start: function(){
    document.body.style.cursor = 'auto'
  },
  questions: [
    {prompt: "What is your gender?", rows: 2, columns:50 , required:true}, 
    {prompt: "What is your age?", rows: 1, columns: 50, required:true},
    {prompt: "What is your first language?", rows: 1, columns: 50, require: false}
  ],
  preamble: `<div>Thanks for completing our study!  Please answer the following questions and then press Continue. </div>`
};


var payment_choice = {
  type: 'survey-multi-choice',
  on_start: function(){
    document.body.style.cursor = 'auto'
  },
  questions: [{
      prompt: "How would you like to be paied?",
      options: ["Venmo", "Paypal", "Zelle"],
      required: true
    }
  ],
  randomize_question_order: false
}

var payment_survey = {
  type: 'survey-text',
  on_start: function(){
    document.body.style.cursor = 'auto'
  },
  questions: [
    {prompt: "What is your name?", rows: 2, columns:50 , required:true}, 
    {prompt: "What is the account name or email address associated with your Venmo/Zelle/Paypal account?", rows: 1, columns: 50, require: true},
  ],
  preamble: `<div> Please answer the following questions and then press Continue. </div>`
};

var collect_address_info = {
  type: 'survey-text',
  on_start: function(){
    document.body.style.cursor = 'auto'
  },
  questions: [
    {prompt: "Mailing address:  ", rows: 4, columns:50 , required:true}
  ],
  preamble: `<div>Congratulations! You have been randomly selected to receive a food item!  Please enter your address below and then press Continue to see what you have won.</div>`
};

var address_node = {
  timeline: [collect_address_info]
}

var choices_node = {
  timeline: [instructions_trials,
    practice_choices,
    instructions_choices,
    choices],
  conditional_function: function(){
      if(ratings_good == 1){
          return true;
      } else {
          return false;
      }
  }
}

var reward_node = {
  timeline: [address_node,
    post_choices,
  choiceReward,
fpReward,
wtpReward],
conditional_function: function(){
  if(get_food_random_chance == 10 && ratings_good == 1){
      return true;
  } else {
      return false;
  }
}
}
//////////////////////
/** Run Experiment */
/////////////////////
if (do_practice == 1) {
  function startExperiment() {
    jsPsych.init({
      timeline: [
        fullscreen,
        instructions_Ratings,
        ratings,
        instructions_trials,
        instructions_choices,
        choices,
        post_choices,
        choiceReward,
        fpReward,
        wtpReward,
        success_check
      ],
      on_trial_finish: function () {
        trialcounter = jsPsych.data.get().count();
        if (successExp) {
          closeFullscreen();
          survey_code = makeSurveyCode('pass_all');
          jsPsych.endExperiment(endofExp(survey_code));
        } else if (trialcounter % 20 == 0) {
          on_close_callback()
        }
      },
      preload_images: [practice_images, stimuli_array],
      on_close: () => on_close_callback(),
      on_finish: () => on_finish_callback()
    })
  };
} else {
  function startExperiment() {
    jsPsych.init({
      timeline: [
        //start_exp_survey_trial,
        fullscreen,
        instructions_Welcome,
        instructions_Ratings, ratings,
        choices_node,
        demographic_survey,
        payment_choice,
        payment_survey,
        reward_node,
        success_check
      ],
      on_trial_finish: function () {
        trialcounter = jsPsych.data.get().count();
        if (successExp) {
          closeFullscreen();
          survey_code = makeSurveyCode('pass_all');
          jsPsych.endExperiment(endofExp(survey_code));
        } else if (trialcounter % 20 == 0) {
          on_close_callback()
        }
      },
      preload_images: [practice_images, stimuli_array],
      on_close: () => on_close_callback(),
      on_finish: () => on_finish_callback()
    })
  };
};
/*
  function startExperiment() {
    jsPsych.init({
      timeline: [
        start_exp_survey_trial,
        fullscreen,
        instructions_Welcome,
        instructions_Ratings, ratings,
        instructions_trials,
        practice_choices,
        instructions_phase1,
        choice_phase1,
        instructions_phase2,
        choice_phase2,
        success_check
      ],
      on_trial_finish: function () {
        trialcounter = jsPsych.data.get().count();
        if (successExp) {
          closeFullscreen();
          survey_code = makeSurveyCode('pass_all');
          jsPsych.endExperiment(endofExp(survey_code));
        } else if (trialcounter % 20 == 0) {
          on_close_callback()
        }
      },
      preload_images: [practice_images, healthy_stimuli_array, unhealthy_stimuli_array],
      on_close: () => on_close_callback(),
      on_finish: () => on_finish_callback()
    });
  }; */