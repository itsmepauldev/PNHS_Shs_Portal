<?php

Broadcast::channel('adviser.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id; // Only allow logged-in adviser to hear their channel
});
