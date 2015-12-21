var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false),
		document.addEventListener("resume", this.onResume, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        resumeState();
    },
    onResume: function() {
        app.receivedEvent('resume');
    },
    receivedEvent: function(id) {
        $('#console').text('--event: ' + id + '--');
    }
};
// phonegap functions
	// message alert
	function onConfirm(buttonIndex) {
	    //alert('You selected button ' + buttonIndex);
	}
	function showConfirm() {
	    navigator.notification.confirm(
	        'How are you feeling today?',  // message
	        onConfirm,              // callback to invoke with index of button pressed
	        'Game Over',            // title
	        'Add mood...,Cancel'          // buttonLabels
	    );
	}


// fastclick
window.addEventListener('load', function() {
	new FastClick(document.body);
}, false);


// fake data
function setup_test_data() {
	var testdata = [],
		start = new Date("01/01/2011"),
		end = new Date("05/06/2013"),
		i = 1;
	while(start < end){
		var newDate = start.setDate(start.getDate() + 1);
		start = new Date(newDate);
		clean_date = moment(start).format('YYYY-MM-DD');       
		testdata.push({
			"gratitude1": ('grateful #' + i),
			"gratitude2": 'great',
			"gratitude3": 'pretty good, too',
			"journal": 'special note #' + i,
			"exercise": _.random(0,100),
			"exercise_note": 'activity #' + i,
			"meditation": _.random(0,180),
			"kindness": 'kind act #' + i,
			"date": clean_date
		});
		i++;
    }
	return testdata;
}


// reset local data
//localStorage['happy_data']=JSON.stringify('');


// var setup
function happyViewModel() {
	self = this;

	self.saved = ko.observableArray();
	self.currentMoodDate = ko.observable( moment().format('YYYY-MM-DD') );

	self.gratitude1 = ko.observable();
	self.gratitude2 = ko.observable();
	self.gratitude3 = ko.observable();
	self.journal = ko.observable();
	self.exercise = ko.observable();
	self.exercise_note = ko.observable();
	self.meditation = ko.observable();
	self.kindness = ko.observable();

	// get current mood based on currentMoodDate
	self.currentMood = ko.computed(function() {
		console.log('--compute currentMood--');
		data = _.where(self.saved(), { date: self.currentMoodDate() });
		if (data[0] !== undefined) {
			self.gratitude1(data[0]['gratitude1']);
			self.gratitude2(data[0]['gratitude2']);
			self.gratitude3(data[0]['gratitude3']);
			self.journal(data[0]['journal']);
			self.exercise(data[0]['exercise']);
			self.exercise_note(data[0]['exercise_note']);
			self.meditation(data[0]['meditation']);
			self.kindness(data[0]['kindness']);
		}
		return data[0];
	}, self);
}


var happy = { viewModel: new happyViewModel() };
ko.applyBindings(happy.viewModel);


// loading localstorage data
function getData() {
	//json = JSON.parse(localStorage['happy_data']);
	json = setup_test_data().reverse();
	var dumpArray = [];
	for (var mood in json) {
		// date formatting
		date = json[mood].date;
		json[mood].day = moment(date, 'YYYY-MM-DD').format('D');
		json[mood].day_name = moment(date, 'YYYY-MM-DD').format('ddd');
		json[mood].month_name = moment(date, 'YYYY-MM-DD').format('MMM');

		// add to observable
		dumpArray.push(json[mood]);
	}
	happy.viewModel.saved(dumpArray);
	// set width for scrolling date box
	$('#dates').css('min-width', (json.length * 46) );
	return json;
}


// save to localstorage
function save() {
	data = {
		"gratitude1": self.gratitude1(),
		"gratitude2": self.gratitude2(),
		"gratitude3": self.gratitude3(),
		"journal": self.journal(),
		"exercise": self.exercise(),
		"exercise_note": self.exercise_note.val(),
		"meditation": self.meditation.val(),
		"kindness": self.kindness.val(),
		"date": $('#date').val()
		};
	if (happy.happy_data.length === 0) { // add data
		happy.happy_data = [data];
	} else {
		if ( happy.happy_data[ happy.happy_data.length - 1 ]['date'] === happy.current_date() ) {
			// update data
			happy.happy_data.pop();
			happy.happy_data.push(data);
		} else {
			// append data
			happy.happy_data.push(data);
		}
	}
	localStorage['happy_data']=JSON.stringify(happy.happy_data);
}


// randomize colors
function randomColors() {
	var data = [0,1,2,3,4,5,6];
	var colors = [ 
		{"s": "97d3bf", "e": "46567a" },
		{"s": "00aeae", "e": "6db108" },
		{"s": "fe6639", "e": "d6c324" },
		{"s": "9cbea5", "e": "3f4c43" },
		{"s": "84b03c", "e": "1f3415" },
		{"s": "1a8895", "e": "259057" },
		{"s": "e3e081", "e": "9d323a" },
		{"s": "4f4c63", "e": "86d47e" },
		{"s": "86d47e", "e": "4f4c63" }
	];

	// random hex color
	// http://paulirish.com/2009/random-hex-color-code-snippets/
	// var color1 = '#'+Math.floor(Math.random()*16777215).toString(16);
	// var color2 = '#'+Math.floor(Math.random()*16777215).toString(16);

	color_index = _.random(0, (colors.length - 1));
	var color1 = '#'+colors[color_index].s;
	var color2 = '#'+colors[color_index].e;
	
	var color = d3.scale.linear()
	   .domain([0,5])  // min/max of data
	   .range([color1, color2])
	   .interpolate(d3.cie.interpolateLch);

	$('form li').css("background", function(d) { return color(d) });
}


// [todo] resume
function resumeState() {
	// reset form
	//$('#happy')[0].reset();
}


// page actions
jQuery(function(){

	// load today's data if found
	happy.viewModel.saved(getData());

	// colors
    randomColors();

	// colors
	$('h1').css("color", happy.color2)

	// save on form changes
	// $('form#happy :input').change(function() {
		// if ( $('#date').val() === happy.today ) {
		// 	save();
		// }
	// });

	$('#happytitle').click(function() {
		// slide header open and page closed
		$('header').toggleClass('closed');
		$('.page').toggleClass('open');
	});

	// click
	$('body').on('click', 'form li', function(e){
		if (e.target.localName === 'li' || e.target.localName === 'h2' ) {
			$(this).toggleClass('closed');
		}
	});

	$('footer').click(function() {
		randomColors();
	});

	$('.datelink').click(function() {
		// update form with date
		var date = $(this).data('date');
		self.currentMoodDate(date);
		
		$('.datelink.today').removeClass('today');
		$(this).addClass('today');
		
		return false;
	});

});