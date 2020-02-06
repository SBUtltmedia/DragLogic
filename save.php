<?
file_put_contents("record.json", $_POST['data'], FILE_APPEND | LOCK_EX);
