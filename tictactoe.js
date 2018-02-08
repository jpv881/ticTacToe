(function () {

    var player = {
        human: 1,
        cpu: 2
    };

    var panel = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var selection;
    var cpuSelection;
    var currentPlayer = player.human;
    var cells;
    var games = 1;
    var finished = false;
    var contCpu = 0;
    var contHuman = 0;

    cells = $(".col span");

    $("#reset").on("click", function () {
        reset();
    });
    
    $("#continue").on("click",function(){
        continueGame();
    });

    //player selection X
    $("#x").on("click", function () {
        selection = "X";
        cpuSelection = "O";
        $("#tic").children().first().css("display", "none");
        $("#grid").css("display", "inherit");
        $("#divTurns").css("display", "inherit");
    });

    // player selection O
    $("#o").on("click", function () {
        selection = "O";
        cpuSelection = "X";
        $("#tic").children().first().css("display", "none");
        $("#grid").css("display", "inherit");
        $("#divTurns").css("display", "inherit");
    });

    //click on cells
    $(".col").on("click", function () {
        if (currentPlayer == player.human && !finished) {
            if (panel[$(this).attr("cell")] === 0) {
                panel[$(this).attr("cell")] = player.human;
                draw();
                currentPlayer = player.cpu;
                var result = getWinner();

                if (result == 10) {
                    cpuTurn();
                } else if (result == 0) {
                    $("#finish").css("display","inherit");
                    $("#finish > span:nth-child(1)").html("TIE!!");
                    finished = true;
                } else if (result == -1) {
                    $("#finish").css("display","inherit");
                    $("#finish > span:nth-child(1)").html("YOU WIN!!");
                    contHuman++;
                    $("#divTurns > span:nth-child(4)").html(contHuman);
                    finished = true;
                }
            }
        }

    });

    function cpuTurn() {
        var position = 0;
        var aux;
        var best = -1000;

        for (var i = 0; i < panel.length; i++) {
            if (panel[i] == 0) {
                panel[i] = player.cpu;
                aux = min();

                if (aux > best) {
                    best = aux;
                    position = i;
                }

                panel[i] = 0;
            }
        }

        panel[position] = player.cpu;
        draw();
        currentPlayer = player.human;
        //cpu wins
        if(getWinner()==1){
            $("#finish").css("display","inherit");
            $("#finish > span:nth-child(1)").html("COMPUTER WINS!!");
            contCpu++;
            $("#divTurns > span:nth-child(4)").html(contCpu);
            finished = true;
            
            //tie
        }else if(getWinner()==0){
            $("#finish").css("display","inherit");
            $("#finish > span:nth-child(1)").html("TIE!!");
            finished = true;
        }
    }

    function min() {
        var win = getWinner();
        if (win != 10) {
            if (win == 0) return 0;
            else return 1;
        }
        var aux;
        var best = 1000;

        for (var i = 0; i < panel.length; i++) {
            if (panel[i] == 0) {
                panel[i] = player.human;
                aux = max();

                if (aux < best) {
                    best = aux;
                }

                panel[i] = 0;
            }
        }

        return best;
    }

    function max() {
        var win = getWinner();
        if (win != 10) {
            if (win == 0) return 0;
            else  return -1;
        }
        var aux;
        var best = -1000;

        for (var i = 0; i < panel.length; i++) {
            if (panel[i] == 0) {
                panel[i] = player.cpu;
                aux = min();

                if (aux > best) {
                    best = aux;
                }

                panel[i] = 0;
            }
        }

        return best;
    }

    //draw the game
    function draw() {
        for (var i = 0; i < panel.length; i++) {
            if (panel[i] === 1) {
                cells[i].innerText = selection;
            } else if (panel[i] === 2) {
                cells[i].innerText = cpuSelection;
            } else if (panel[i] === 0) {
                cells[i].innerText = "";
            }
        }
    }

    //reset all
    function reset() {
        for (var i = 0; i < panel.length; i++) {
            panel[i] = 0;
        }
        draw();
        finished = false;
        contHuman = 0;;
        $("#divTurns > span:nth-child(4)").html(contHuman);
        contCpu = 0;
        $("#divTurns > span:nth-child(4)").html(contCpu);
        games = 1;
        $("#finish").css("display","none");
        currentPlayer = player.human;
    }
    
    function continueGame(){
        for(var i=0;i<panel.length;i++){
            panel[i]=0;
        }
        
        games++;
        if(games%2==0){
            panel[Math.floor(Math.random() * 9)] = player.cpu;
        }
        
        currentPlayer = player.human;
        finished = false;
        $("#finish").css("display","none");
        draw();
    }

    // -1 human, 1 cpu, 0 tie, 10 continue
    function getWinner() {

        //horizontal
        for (i = 0; i <= 6; i += 3) {
            if (panel[i] == player.human && panel[i + 1] == player.human && panel[i + 2] == player.human) return -1;
            if (panel[i] == player.cpu && panel[i + 1] == player.cpu && panel[i + 2] == player.cpu) return 1;
        }

        //vertical
        for (i = 0; i < 3; i++) {
            if (panel[i] == player.human && panel[i + 3] == player.human && panel[i + 6] == player.human) return -1;
            if (panel[i] == player.cpu && panel[i + 3] == player.cpu && panel[i + 6] == player.cpu) return 1;
        }

        //diagonal
        if (panel[0] == player.human && panel[4] == player.human && panel[8] == player.human ||
            panel[2] == player.human && panel[4] == player.human && panel[6] == player.human) return -1;

        if (panel[0] == player.cpu && panel[4] == player.cpu && panel[8] == player.cpu ||
            panel[2] == player.cpu && panel[4] == player.cpu && panel[6] == player.cpu) return 1;

        var tie = true;
        //tie
        for (i = 0; i < panel.length; i++) {
            if (panel[i] == 0) tie = false;
        }

        if (tie) return 0;
        else return 10;
    }

})();