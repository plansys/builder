<?php

namespace Plansys\Builder;

use Symfony\Component\Filesystem\Filesystem;

abstract class Tab
{
    public abstract function open();

    public abstract function save();
}