<?php

namespace Plansys\Builder;

use Plansys\Builder\Page\Tree;

class Page
{
    public $tree;
    public $base;

    public function __construct($base) {
        $this->base = $base;
        $this->tree = new Tree();
    }
}