var EventBus = Packages.me.mast3rplan.phantombot.event.EventBus;
var DonationEvent = Packages.me.mast3rplan.phantombot.event.donation.DonationEvent;


$.on('donation', function (event) {
    var donator = event.getDonator().toLowerCase();
    var username = $.username.resolve(donator);
    var amount = event.getAmount();
    var message = event.getMessage();
    var p = $.donationReward * amount;
    $.say(username+" donated "+amount+" with this Message: "+message);

	if (!$.inidb.FileExists("donations")) {
		var id = 0
	} else {
	    var id = $.inidb.GetKeyList("donations")[0];
	}
    $.say(id[0]);
    return;
    $.inidb.set("donations", id, username+"|"+amount+"|"+message);

    if ($.announceDonations == 1 && $.moduleEnabled("./handlers/donationHandler.js")) {
        var s = $.lang.get("net.phantombot.donationhandler.new-donation");
        s = $.replaceAll(s, '(name)', username);
        s = $.replaceAll(s, '(amount)', amount);
        s = $.replaceAll(s, '(message)', message);
        
        if ($.moduleEnabled("./systems/pointSystem.js")) {
            s = $.replaceAll(s, '(pointname)', $.getPointsString(p));
            s = $.replaceAll(s, '(reward)', p.toString());
        }
    }

    $.writeToFile(username+": "+amount, "./web/latestdonation.txt", false);
    if ($.moduleEnabled("./systems/pointSystem.js") && p > 0) {
        $.inidb.incr('points', follower, p);
    }
});

$.checkerstorepath = $.inidb.get('settings','checker_storepath');
if ($.checkerstorepath == null || $.checkerstorepath == "" || $.strlen($.checkerstorepath) == 0) {
    $.checkerstorepath = "addons/donationchecker/latestdonation.txt";
}

$.announceDonations = $.inidb.get('settings','announceDonations');
if ($.announceDonations == null || $.announceDonations == "" || $.strlen($.announceDonations) == 0) {
    $.announceDonations = 1;
}

$.on('command', function (event) {
    var sender = event.getSender();
    var command = event.getCommand();
    var args = event.getArgs();
    var argsString = event.getArguments().trim();
    
    if (argsString.isEmpty()) {
        args = [];
    } else {
        args = argsString.split(" ");
    }
    
    if (command.equalsIgnoreCase("donationalert")) {
        if (!$.isAdmin(sender)) { // added this check so people can't spam the usage.
            $.say($.getWhisperString(sender) + $.adminmsg);
            return;
        } 

        var action = args[0];

        if (args.length == 0) { // added usage
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.donationhandler.donationalert-usage"));
            return;
        }
        
        if (action.equalsIgnoreCase("filepath")) {
            if (!$.isAdmin(sender)) {
                $.say($.getWhisperString(sender) + $.adminmsg);
                return;
            }
            
            if (args[1].equalsIgnoreCase('viewfilepath')) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.donationhandler.current-file-path", $.checkerstorepath));
                return;
            }
            
            while (args[1].indexOf('\\') != -1 && !args[1].equalsIgnoreCase('viewfilepath') && args[1] != "" && args[1] != null) {
                args[1] = args[1].replace('\\', '/');
            }
            
            $.inidb.set('settings','checker_storepath', args[1]);
            $.checkerstorepath = args[1];
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.donationhandler.new-file-path-set"));
            return;
        }

        if (action.equalsIgnoreCase("toggle")) {
            if ($.announceDonations == 1) {
                $.inidb.set('settings','announceDonations', 0);
                $.announceDonations = 0;
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.donationhandler.donation-toggle-off"));
                return;
            } else {
                $.inidb.set('settings','announceDonations', 1);
                $.announceDonations = 1;
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.donationhandler.donation-toggle-on"));
                return;
            }
        }
    }
});

//Q: why is there a timeout delay here before a timer? seems redundant no?
//A: the timeout sets a delay to start the timer, otherwise the timer won't detect if a module is disabled (because it hasnt loaded in yet)
setTimeout(function(){ 
    if ($.moduleEnabled("./handlers/donationHandler.js")) {
        $.timer.addTimer("./handlers/donationHandler.js", "currdonation", true, function() {
            $var.currDonation = $.readFile($.checkerstorepath);
            if ($var.currDonation.toString() != $.inidb.get("settings", "lastdonation")) {
                if ($var.currDonation.toString() != null || $var.currDonation.toString() != "") {
                    $.inidb.set("settings", "lastdonation", $.readFile($.checkerstorepath));
        		    EventBus.instance().post(new DonationEvent($.readFile($.checkerstorepath).toString(), 0));
                }
            }
        }, 10 * 1000);
    }
    $.registerChatCommand("./handlers/donationHandler.js", "donationalert", "mod");
}, 10 * 1000);
