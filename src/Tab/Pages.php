<?php

namespace Plansys\Builder\Tab;

use Plansys\Builder\Module;
use Plansys\Builder\Tab;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

class Pages extends Tab
{
    public $base;
    private $page;

    function __construct($app, $base, $moduleName, $pageName, $path = '')
    {
        if (is_object($base) && get_class($base) == 'Yard\Base') {
            $this->base = $base;
            $this->page = new Module\Pages($base, $moduleName, $pageName, $path);
        } else {
            throw new \Exception('Base must be an Yard\Base instance');
        }
    }

    public function open() {
        $values = $this->page->open();
        var_dump($values); die();
        $data = [
            'type' => 'pages',
            'active' => false,
            'saved' => true,
            'label' => $this->page->getPageName(),
            'history' => [],
            'content' => [],
        ];

        foreach ($values as $k=>$v) {
            $data['content'][] = [
                'type' => $k,
                'active' => false,
                'value' => $v
            ];
        }

        return $data;
    }

    public function save() {
        
    }
}