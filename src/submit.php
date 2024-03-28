<?php

$conn = mysqli_connect('localhost', 'root', '', 'Form');

if (!$conn) {
    die('Database connection failed!');
}

$Name = mysqli_real_escape_string($conn, $_POST['Name']);
$Grade = mysqli_real_escape_string($conn, $_POST['Grade']);
$Paid = mysqli_real_escape_string($conn, $_POST['Paid']);

if (empty($Name) || empty($Grade) || empty($Paid)) {
    echo 'Please fill in all fields';
} else {
    $query = "INSERT INTO form (Name, Grade, Paid) VALUES ($Name, $Grade, $Paid)";

    if (mysqli_query($conn, $query)) {
        echo 'Form submitted successfully!';
    } else {
        echo 'Error submitting form';
    }
}

mysqli_close($conn);

?>