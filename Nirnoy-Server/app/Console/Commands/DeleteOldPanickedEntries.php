<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use app\Models\Panicked;

class DeleteOldPanickedEntries extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delete-old-panicked-entries';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Panicked::where('created_at', '<', now()->subMinutes(10))->delete();
    }

}
