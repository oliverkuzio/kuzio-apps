PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sites` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`href` text NOT NULL,
	`color` text NOT NULL,
	`border_color` text DEFAULT 'transparent' NOT NULL,
	`hover_background_color` text DEFAULT '#d4d4d8' NOT NULL,
	`hover_text_color` text DEFAULT 'text-base-content' NOT NULL,
	`hover_theme` text DEFAULT 'dark' NOT NULL,
	`image` text NOT NULL,
	`icon` integer DEFAULT false NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_sites`("id", "user_id", "name", "href", "color", "border_color", "hover_background_color", "hover_text_color", "hover_theme", "image", "icon", "active", "created_at", "updated_at") SELECT "id", "user_id", "name", "href", "color", "border_color", "hover_background_color", "hover_text_color", "hover_theme", "image", "icon", "active", "created_at", "updated_at" FROM `sites`;--> statement-breakpoint
DROP TABLE `sites`;--> statement-breakpoint
ALTER TABLE `__new_sites` RENAME TO `sites`;--> statement-breakpoint
PRAGMA foreign_keys=ON;