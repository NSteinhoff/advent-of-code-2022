#include "prelude.h"

#define INDENT 4
#define VERBOSE 0

static char const example[] = "$ cd /\n"
			      "$ ls\n"
			      "dir a\n"
			      "14848514 b.txt\n"
			      "8504156 c.dat\n"
			      "dir d\n"
			      "$ cd a\n"
			      "$ ls\n"
			      "dir e\n"
			      "29116 f\n"
			      "2557 g\n"
			      "62596 h.lst\n"
			      "$ cd e\n"
			      "$ ls\n"
			      "584 i\n"
			      "$ cd ..\n"
			      "$ cd ..\n"
			      "$ cd d\n"
			      "$ ls\n"
			      "4060174 j\n"
			      "8033020 d.log\n"
			      "5626152 d.ext\n"
			      "7214296 k";

typedef enum { D, F } Type;
typedef struct Entry Entry;

typedef struct {
	char name[24];
	int size;
} File;

typedef struct {
	char name[24];
	int size;
	Entry **entries;
	size_t len;
	size_t cap;
} Directory;

struct Entry {
	Type type;
	union {
		File f;
		Directory d;
	};
};

static Entry *new_dir(char const *name) {
	Entry *d = malloc(sizeof(Entry));
	d->type = D;
	d->d.size = 0;
	d->d.len = 0;
	d->d.cap = 0;
	d->d.entries = NULL;
	strncpy(d->d.name, name, 24);
	return d;
}

static Entry *new_file(char const *name, int size) {
	Entry *f = malloc(sizeof(Entry));
	f->type = F;
	f->f.size = size;
	strncpy(f->f.name, name, 24);
	return f;
}

static void push(Directory *dir, Entry *entry) {
	if (dir->len >= dir->cap) {
		dir->cap = dir->cap ? dir->cap * 2 : 2;
		dir->entries =
			realloc(dir->entries, sizeof(Entry * [dir->cap]));
		push(dir, entry);
		return;
	}
	dir->entries[dir->len++] = entry;
}

static void print(Entry const *entry, int depth) {
	printf("%*s", depth * INDENT, "");

	switch (entry->type) {
	case F: {
		printf("%s: %d\n", entry->f.name, entry->f.size);
		break;
	}
	case D: {
		printf("%s%s: (%zu) %d\n", entry->d.name,
		       !strcmp(entry->d.name, "/") ? "" : "/", entry->d.len,
		       entry->d.size);
		for (size_t i = 0; i < entry->d.len; i++)
			print(entry->d.entries[i], depth + 1);
		break;
	}
	}
}

static bool startswith(char const *s, char const *prefix) {
	return !(strncmp(s, prefix, strlen(prefix)));
}

static bool empty(char const *s) {
	return !strcmp(s, "");
}

static char *parse(Directory *parent, char *input) {
	LINES(line, input) {
		if (empty(line)) continue;
		if (startswith(line, "$ cd ..")) return input;
		if (startswith(line, "$ cd /")) continue;
		if (startswith(line, "$ ls")) continue;
		if (startswith(line, "dir")) continue;
		if (startswith(line, "$ cd")) {
			char name[24];
			assert(sscanf(line, "$ cd %23s", name) == 1);
			Entry *dir = new_dir(name);
			push(parent, dir);
			input = parse(&dir->d, input);
			parent->size += dir->d.size;
		} else {
			char name[24];
			int size;
			assert(sscanf(line, "%d %23s", &size, name) == 2);
			Entry *file = new_file(name, size);
			push(parent, file);
			parent->size += file->f.size;
		}
	}

	return input;
}

static int tally(Entry const *entry) {
	if (entry->type == F) return 0;

	int sum = 0;
	if (entry->d.size <= 100000) sum += entry->d.size;
	for (size_t i = 0; i < entry->d.len; i++)
		sum += tally(entry->d.entries[i]);

	return sum;
}

static void destroy(Entry *entry) {
	if (entry->type == D) {
		for (size_t i = 0; i < entry->d.len; i++)
			destroy(entry->d.entries[i]);
		free(entry->d.entries);
	}

	free(entry);
}

static int solve(char *input) {
	Entry *root = new_dir("/");
	parse(&root->d, input);
	if (VERBOSE) print(root, 0);
	int total = tally(root);
	destroy(root);

	return total;
}

int main() {
	RUN(solve, strdup(example));
	RUN(solve, read_to_string("7.txt"));
}
