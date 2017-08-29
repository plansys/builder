<?php

namespace Plansys\Builder;

class Init
{
    public static function getBase($host)
    {
        return [
            'redux' => realpath(dirname(__FILE__) . '/..') . '/redux',
            'dir' => realpath(dirname(__FILE__) . '/..') . '/pages',
            'url' => '/' . trim($host, '/') . '/vendor/plansys/builder/pages/'
        ];
    }
}
