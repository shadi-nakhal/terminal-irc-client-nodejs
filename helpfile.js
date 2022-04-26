const text = `

                          ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                        ▓▀▀                ▀▀▓▓▓▓
                    ▓█▀▀                          ▓
                  ▒▓▀        ░ ░░░░░░░░░▒▒░░▒░    ▐██
               ▄▓███   ▒▒░ ▄▒▒░░░░     ░░▒▒▒▒▒▒░░▌ ▄░██
              ▓████▒█  ▄▒▒                   ▒▒▒██▒▒▀██
             ▓██████▓███ ░                        ▀███▒█
            ▓████████▀                             ▀█████
            ███████                                  █████
           ███████▒                                  ████
           ██████▌                                   ▓▓██
           █████▓      ▄▄▓████████████████████▓▄▄   █▓███
           ██████    ▓▓█████████████▀▀█████████████▓▄▐▌██
           ███████▒▄▓███▀▒▒▒▄███▀██   ▀████▒▒▒▒▒▀████████
           ▐██████▓███▀▓▄███████▓▓     ▐▓▓█████████████▓█
            ███████▓▒▒▒█████▓█▓▓▓       ▀▓▓▒▓▓█████▓████░
            ▓████▌▓▓▒▒▒▒▓▓▓▓▓▒▒▒         ▀▓▓▓▓▓▓▓▒▒▒▓██▒
           ▄▓████ ▓▓▓▒▒▒▒▒▒▒▒▒▒▒▓███▓█████▄▒▒▒▒▒▒▒▒▓███▒
          ████▓█▌▓██▓▓▒▓▓▓▓▒▒░▐████████████▒▒▒▒▒▒▒▒▓▓██
          ▓▓█▒███▓██▓▓▓▓▓▓▓▒▒▒▒▀▒▒▒▒▒▒▒▒▒▒▌▒▒▓▓▓▓▓▓▓█
          ▓▓█▒▒████▓▓▓▓███▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▓     ▓▓▓▓▓▓█
           ▓█▒▒▀█████▓▓▓█▓▓▓▒▒░▒▒▒▒▒▒▒▄▄▓ ▄  ▓▓▓▓▒▒▓▓
            ▓▓▓▓▓██▓██▓▓▓███▓▓▓▓▓███████████▓▓▒▓▓▒▒▒▓▓
            ▓█▀▒██▓█▓▓▓▓▓██████▀▒▒▒▒▒▒▒▒▒▒▒▀▀▒▒▒▒▒▒▓▓
             ▀▓▀▒▒▓█▓▓▒▓▓▀▒▒▒▓▓▒▒▒▒▒▒▒▒▒▒▒     ▒▒▓▓▌
                  ░███▓▒▒▒▒▒▒▒▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▓▓█
                   ▓███▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒      ▒ ▒▓▓██
                    ███▓▓▓▓▒▒ ▒▒▒▒▒▒▒▒▒    ▒▄▓▓████▒
                   ▐███████▓▓▓▒▒▒▓▓▒▓▓▒▓▓▓▓▓▓▓███████
                  ▓███████████▓▓███████████████████▄

^yflags:
^y-s [server/port] "server and port"
^y-n [nickname] "nickname"
^y-u [username] "username"
^y-r ["realname"] "realname, must be wraped with quotes"
^y-c ["#channel1 #channel2"] "channels to be joined on connect, must be wraped with quotes and separated with a space"
^y-p [serverpassword] "server password"
^y-i [password] "nickname password for NickServe auto identification"
^y-t "use tls connection".
^y-a "reject invalid certificates"^ its false by default.


^RWarning all passwords are stored as plain text!^

^R/server^

options: 

show [name] "shows a specific saved profile"

show "lists all saved profile"

show all "lists all saved profile"

add [name] "adds a profile"

del [name] "deletes a profile"

usage : /server add libera -s irc.libera.chat/6667 -n Fr4nk -u Frankie -r "monster" -c "#javascript"

^RWarning all passwords are stored as plain text!^

^R/connect^

example1 : /connect -s irc.libera/6667 -n Fr4nk -c "#javascript"
example2 : /connect [profilename]

^R/query
^R/close
^R/join
^R/kick
^R/ban
^R/unban
^R/op
^R/deop 
^R/voice
^R/devoice
^R/clear^
^R/mode^
^R/ns^ /ns identify nickname password
^R/memory^ check memory
^R/error^ invoke connection error
^R/timeout^ invoke timeout
^R/test^ checks some event listeners for leaks
^R/test2^ checks tls socket
^R/raw^ toggle server's status buffer tag view to raw
^R/quit^

^yALT + Q and ALT + A to scroll channels
^yUP arrow key and Down arrow key to scroll nicknames
^yPAGE_UP and PAGE_DOWN to scroll Main
^yTAB to auto complete a nickname


press PAGE UP!
`;

module.exports = { text };
