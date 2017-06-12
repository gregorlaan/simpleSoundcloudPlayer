SC.initialize({
  client_id: '1CdvYD2P3gxiisywcl4kWOckK5nTPaH5'
});

$(document).ready(function(){
	var duration;
	var durationSeconds;
	SC.stream('/tracks/324053024').then(function(player){
		var track = player;
		var trackState;
        var trackVolume;
		$(".play-btn").on("click", function() {
			track.play();
		});
		$(".pause-btn").on("click", function() {
			track.pause();
		});

		$(".stop-btn").on("click", function() {
			track.seek(0);
			track.pause();
		});
		$(document).on('change', '#volume', function() {
			var volume = $(this).val();
			trackVolume = volume / 100;
			track.setVolume(trackVolume);
			$(".current-volume").css("height", volume + "%" );
			$(".mute-btn").removeClass("active");
		});
		$(document).on('change', '#time-slider', function() {
			timeSlider = $(this).val();
			var currentTime = track.currentTime();
			var currentTimeSeconds = Math.round(currentTime / 1000);
			var setSeek = duration * timeSlider / 100;
			track.seek(setSeek);
			var currentTimePercentage = currentTimeSeconds / durationSeconds * 100;
		});
		track.on("time", function() {
			var time = track.currentTime();
			var timeSeconds = Math.round(time / 1000);
			var timeMinutes = Math.floor(timeSeconds / 60);
			var timeMinutesFinal = ('0' + timeMinutes).slice(-2); // adding 0 in front of a number if less than 10
			var timeSecondsLeft = Math.round(timeSeconds % 60);
			var timeSecondsLeftFinal = ('0' + timeSecondsLeft).slice(-2);  // adding 0 in front of a number if less than 10
			$("#current-time").html(timeMinutesFinal + ":" + timeSecondsLeftFinal);
			var currentTimePercentage = time / duration * 100;
			$(".current-time").css( "width", Math.round(currentTimePercentage) + "%" );
		});
        $(".mute-btn").on( "click", function() {
			$(this).toggleClass("active");
            return $(this).hasClass("active") ? muted(this) : unmuted(this);
		});
        function muted(){
            track.setVolume(0);
        }
        function unmuted(){
			track.setVolume(trackVolume);
        }
		$( "input#volume" ).mousedown(function() { 
			$(".mute-btn.btn").addClass("changing");
		}).mouseup(function() { 
			$(".mute-btn").removeClass("changing");
		});
	});
	
	SC.get('/tracks/324053024').then(function(tracks){
		$("#title").html(tracks.title);
		duration = tracks.duration;
		durationSeconds = duration / 1000;
		var durationMinutes = Math.floor(durationSeconds / 60);
		var durationMinutesFinal = ('0' + durationMinutes).slice(-2);
		var durationSecondsLeft = Math.round(durationSeconds % 60);
		var durationSecondsLeftFinal = ('0' + durationSecondsLeft).slice(-2);  // adding 0 in front of a number if less than 10
		$("#duration").html(durationMinutesFinal + ":" + durationSecondsLeftFinal);
		var avatarImage = tracks.user.avatar_url;
		var bigAvatarImage = avatarImage.replace("large", "t500x500");
		$(".avatar img").attr("src", bigAvatarImage);
		var genre = tracks.genre;
		$("#genre a").html(genre);
		var genreLink = "https://soundcloud.com/tags/" + tracks.genre;
		$("#genre a").attr("href", genreLink);
        var authorLink = tracks.user.permalink_url;
		$(".avatar a").attr("href", authorLink);
        var authorName = tracks.user.username;
        $(".avatar a").attr("title", authorName);
	});
});