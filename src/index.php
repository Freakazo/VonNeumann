<!doctype html>
<html class="no-js" lang="">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="apple-touch-icon" href="apple-touch-icon.png">
    <!-- Place favicon.ico in the root directory -->

    <link rel="stylesheet" href="css/normalize.css">
    <link rel="stylesheet" href="css/main.css">
    <script src="js/vendor/modernizr-2.8.3.min.js"></script>
</head>
<body>
<!--[if lt IE 8]>
<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade
    your browser</a> to improve your experience.</p>
<![endif]-->


<div class="container">
    <div class="header">
    </div>

    <div class="content">

        <!-- Add your site or application content here -->
        <p>Hello world! This is HTML5 Boilerplate.</p>

        <div class="component-L">
            <table name="regs" class="TableSmall component-L" width=30px>
                <tr>
                    <th>R</th>
                    <th>Value</th>
                </tr>
                <?php
                $rows = 32;

                for ($i = 0; $i < $rows; $i++) {
                    echo "<tr><td>" . $i . '</td><td name="R' . $i . 'Value"></td ></tr>';
                }

                ?>
            </table>
        </div>

        <div class="component-R">
            <table id="IR" class="TableSmall">
                <tr>
                    <th>Instruction Register</th>
                </tr>
                <tr>
                    <td name="IRValue"></td>
                </tr>
            </table>
            <table id="PC" class="TableSmall">


                <tr>
                    <th>Program Counter</th>
                </tr>
                <tr>
                    <td name="PCValue">0</td>
                </tr>
            </table>

            <table id="MEM" class="TableSmall">
                <tr><th>Memory</th><th>Value</th></tr>
                <tr>
                    <td>Memory Address</td>
                    <td name="MA"></td>
                </tr>
                <tr>
                    <td>Memory Data</td>
                    <td name="MD"></td>
                </tr>
            </table>
        </div>


        <button id="step-btn">Step</button>

        <div class="CPULog"></div>
    </div>
    <div class="footer"></div>
</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="js/vendor/jquery-2.8.3.min.js"><\/script>')</script>
<script src="js/plugins.js"></script>
<script src="js/Register.js"></script>
<script src="js/InstructionRegister.js"></script>
<script src="js/main.js"></script>
<script src="js/ALU.js"></script>
<script src="js/ControlUnit.js"></script>
<script src="js/SystemBus.js"></script>
<script src="js/Memory.js"></script>
<script src="js/RegisterFile.js"></script>
<script src="js/ProgramCounter.js"></script>
<script src="js/CPU.js"></script>

</body>
</html>
