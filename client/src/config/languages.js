/**
 * Single source of truth for Code Playground languages.
 *
 * To add a new language, add one entry. That's it.
 *   - `id`         internal id used in state, snippets, monaco language mode
 *   - `label`      display name in picker
 *   - `runner`     'browser' | 'piston'
 *   - `piston`     if runner==='piston': { language, filename }
 *                  (language must match a name from https://emkc.org/api/v2/piston/runtimes)
 *   - `monaco`     monaco editor language id (defaults to `id` if omitted)
 *   - `starter`    default code shown when the language is selected
 *   - `color`      tailwind classes for the picker highlight
 */

export const LANGUAGES = [
  {
    id: 'python',
    label: 'Python',
    runner: 'browser',
    monaco: 'python',
    color: 'text-brutal-mint border-brutal-mint',
    starter: '# Python playground\nprint("Hello from VISTA!")\n\nfor i in range(5):\n    print(f"Step {i + 1}")\n',
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    runner: 'browser',
    monaco: 'javascript',
    color: 'text-brutal-yellow border-brutal-yellow',
    starter: '// JavaScript playground\nconsole.log("Hello from VISTA!");\n\nfor (let i = 0; i < 5; i++) {\n  console.log("Step", i + 1);\n}\n',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    runner: 'browser',
    monaco: 'typescript',
    color: 'text-brutal-blue border-brutal-blue',
    starter: '// TypeScript playground\nconst greet = (name: string): string => `Hello, ${name}!`;\nconsole.log(greet("VISTA"));\n\nfor (let i = 0; i < 5; i++) console.log("Step", i + 1);\n',
  },
  {
    id: 'cpp',
    label: 'C++',
    runner: 'piston',
    piston: { language: 'c++', filename: 'main.cpp' },
    monaco: 'cpp',
    color: 'text-brutal-blue border-brutal-blue',
    starter: '#include <iostream>\n#include <vector>\n\nint main() {\n    std::cout << "Hello from VISTA!" << std::endl;\n    std::vector<int> v = {1, 2, 3, 4, 5};\n    for (int x : v) std::cout << x << " ";\n    std::cout << std::endl;\n    return 0;\n}\n',
  },
  {
    id: 'c',
    label: 'C',
    runner: 'piston',
    piston: { language: 'c', filename: 'main.c' },
    monaco: 'c',
    color: 'text-brutal-mint border-brutal-mint',
    starter: '#include <stdio.h>\n\nint main(void) {\n    printf("Hello from VISTA!\\n");\n    for (int i = 0; i < 5; i++) printf("Step %d\\n", i + 1);\n    return 0;\n}\n',
  },
  {
    id: 'java',
    label: 'Java',
    runner: 'piston',
    piston: { language: 'java', filename: 'Main.java' },
    monaco: 'java',
    color: 'text-brutal-orange border-brutal-orange',
    starter: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from VISTA!");\n        for (int i = 0; i < 5; i++) System.out.println("Step " + (i + 1));\n    }\n}\n',
  },
  {
    id: 'kotlin',
    label: 'Kotlin',
    runner: 'piston',
    piston: { language: 'kotlin', filename: 'main.kt' },
    monaco: 'kotlin',
    color: 'text-brutal-purple border-brutal-purple',
    starter: 'fun main() {\n    println("Hello from VISTA!")\n    for (i in 1..5) println("Step $i")\n}\n',
  },
  {
    id: 'go',
    label: 'Go',
    runner: 'piston',
    piston: { language: 'go', filename: 'main.go' },
    monaco: 'go',
    color: 'text-brutal-blue border-brutal-blue',
    starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from VISTA!")\n    for i := 1; i <= 5; i++ {\n        fmt.Println("Step", i)\n    }\n}\n',
  },
  {
    id: 'rust',
    label: 'Rust',
    runner: 'piston',
    piston: { language: 'rust', filename: 'main.rs' },
    monaco: 'rust',
    color: 'text-brutal-orange border-brutal-orange',
    starter: 'fn main() {\n    println!("Hello from VISTA!");\n    for i in 1..=5 {\n        println!("Step {}", i);\n    }\n}\n',
  },
  {
    id: 'csharp',
    label: 'C#',
    runner: 'piston',
    piston: { language: 'csharp', filename: 'Program.cs' },
    monaco: 'csharp',
    color: 'text-brutal-purple border-brutal-purple',
    starter: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello from VISTA!");\n        for (int i = 1; i <= 5; i++) Console.WriteLine($"Step {i}");\n    }\n}\n',
  },
  {
    id: 'php',
    label: 'PHP',
    runner: 'piston',
    piston: { language: 'php', filename: 'main.php' },
    monaco: 'php',
    color: 'text-brutal-purple border-brutal-purple',
    starter: '<?php\necho "Hello from VISTA!\\n";\nfor ($i = 1; $i <= 5; $i++) echo "Step $i\\n";\n',
  },
  {
    id: 'ruby',
    label: 'Ruby',
    runner: 'piston',
    piston: { language: 'ruby', filename: 'main.rb' },
    monaco: 'ruby',
    color: 'text-brutal-red border-brutal-red',
    starter: 'puts "Hello from VISTA!"\n(1..5).each { |i| puts "Step #{i}" }\n',
  },
  {
    id: 'swift',
    label: 'Swift',
    runner: 'piston',
    piston: { language: 'swift', filename: 'main.swift' },
    monaco: 'swift',
    color: 'text-brutal-orange border-brutal-orange',
    starter: 'print("Hello from VISTA!")\nfor i in 1...5 {\n    print("Step \\(i)")\n}\n',
  },
  {
    id: 'dart',
    label: 'Dart',
    runner: 'piston',
    piston: { language: 'dart', filename: 'main.dart' },
    monaco: 'dart',
    color: 'text-brutal-blue border-brutal-blue',
    starter: 'void main() {\n  print("Hello from VISTA!");\n  for (var i = 1; i <= 5; i++) {\n    print("Step $i");\n  }\n}\n',
  },
  {
    id: 'bash',
    label: 'Bash',
    runner: 'piston',
    piston: { language: 'bash', filename: 'main.sh' },
    monaco: 'shell',
    color: 'text-brutal-mint border-brutal-mint',
    starter: '#!/usr/bin/env bash\necho "Hello from VISTA!"\nfor i in 1 2 3 4 5; do\n  echo "Step $i"\ndone\n',
  },
];

/** Fast lookup by id. */
export const LANGUAGE_BY_ID = Object.fromEntries(LANGUAGES.map(l => [l.id, l]));

/** Get a language config safely; falls back to python. */
export function getLanguage(id) {
  return LANGUAGE_BY_ID[id] || LANGUAGE_BY_ID.python;
}
