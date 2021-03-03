/*
 *
 *
 * 
 */

jsPsych.plugins["binary-food-choice"] = (function () {

    var plugin = {};
  
    plugin.info = {
      name: "binary-food-choice",
      parameters: {
        stimulus: {
          type: jsPsych.plugins.parameterType.HTML_STRING,
          pretty_name: 'stimulus',
          default: undefined,
          description: 'The HTML string to be displayed'
        },
        trial_number:{
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'trial number',
          default: undefined,
          description: 'the trial number in the block'
        },
        choices: {
          type: jsPsych.plugins.parameterType.KEYCODE,
          array: true,
          pretty_name: 'choices',
          default: ['F', 'J'], //jsPsych.ALL_KEYS,
          description: 'The keys the subject is allowed to press to respond to the stimulus.'
        },
        timing_response: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'timing_response',
          default: 0,
          description: 'Timing response.'
        }
      }
    };
  
    plugin.trial = function (display_element, trial) {
      trial.timing_response = trial.timing_response || -1;
      trial.choices = trial.choices || [];
  
      var setTimeoutHandlers = [];
      var keyboardListener;
      var response = {
        rt: -1,
        key: -1
      };
      var selected_color = 'rgb(5, 157, 190)';
  
      // display stage: display the stimuli
      var display_stage = function () {
        //console.log('display_stage');
        kill_timers();
        kill_listeners();
  
        display_element.innerHTML = '';
        var on_Screen = '';
        
        //list.push({stimulus1: array1[i].stimulus, stimulus1_food_type: array1[i].food_type, stimulus1_rating: array1[i].rating, stimulus2: array2[j].stimulus, stimulus2_food_type: array2[j].food_type, stimulus2_rating: array2[j].rating, rating_diff: array1[i].rating - array2[j].rating});
  
        
          on_Screen += '<div class="container-multi-choice">';
          on_Screen += '<div class="container-multi-choice-column" id= "multiattribute-choices-stimulus-left">';
          on_Screen += `<div id="multiattribute-choices-stimulus-left " ><img height="250px" width="350px" src="${trial.stimulus.stimulus1}"/></div>`;
          on_Screen += '</div>';
          on_Screen += '<div class="container-multi-choice-column" id= "multiattribute-choices-stimulus-right">';
          on_Screen += `<div id="multiattribute-choices-stimulus-right " ><img height="250px" width="350px" src="${trial.stimulus.stimulus2}"/></div>`;
          on_Screen += '</div>';
          on_Screen += '</div>';
  
        display_element.innerHTML = on_Screen;
      };
  
  
      var display_selection = function () {
        var selected;
        if (String.fromCharCode(response.key) == trial.choices[0]) {
          selected = '#multiattribute-choices-stimulus-left';
        } else {
          selected = '#multiattribute-choices-stimulus-right';
        }
        $(selected).css('border', `6px solid ${selected_color}`);
      };
  
      var display_timeout = function () {
        $('#charity-binary-timeoutinfo').text('Please make your selection more quickly!');
      };
  
  
      var kill_timers = function () {
        for (var i = 0; i < setTimeoutHandlers.length; i++) {
          clearTimeout(setTimeoutHandlers[i]);
        }
      };
  
      var kill_listeners = function () {
        if (typeof keyboardListener !== 'undefined') {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        }
      };
  
      var start_response_listener = function () {
        if (trial.choices != jsPsych.NO_KEYS) {
          keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
            valid_responses: trial.choices,
            rt_method: 'performance',
            persist: false,
            allow_held_key: false,
            callback_function: function (info) {
              kill_listeners();
              kill_timers();
              response = info;
              display_selection();
              //end_trial(false);
              setTimeout(() => end_trial(false), 500);
            },
          });
        }
      };
  
      var display_stimuli = function () {
        kill_timers();
        kill_listeners();
        display_stage();
        start_response_listener();
        if (trial.timing_response > 0) {
          var response_timer = setTimeout(function () {
            kill_listeners();
            display_timeout();
            setTimeout(() => end_trial(true), 500);
          }, trial.timing_response);
          setTimeoutHandlers.push(response_timer);
        }
      };
      var end_trial = function (timeout) {
        // data saving
        var trial_data = {
          "stimulus1": trial.stimulus.stimulus1,
          "stimulus2": trial.stimulus.stimulus2,
          "stimulus1_rating": trial.stimulus.stimulus1_rating,
          "stimulus2_rating": trial.stimulus.stimulus2_rating,
          "timeout": timeout,
          "rt": response.rt,
          "key_press": response.key,
          "choices": trial.choices,
          "trial_number": trial.trial_number
        };
        // console.log(trial_data);
        jsPsych.finishTrial(trial_data);
      };
  
      display_stimuli();
    };
  
    return plugin;
  })();