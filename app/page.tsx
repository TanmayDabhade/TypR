'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const languages: { [key: string]: string } = {
  javascript: `function quickSort(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr[arr.length - 1];
    const left = [];
    const right = [];
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] < pivot) left.push(arr[i]);
      else right.push(arr[i]);
    }
    return [...quickSort(left), pivot, ...quickSort(right)];
  }`,

  python: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[-1]
    left = []
    right = []
    for i in arr[:-1]:
        if i < pivot:
            left.append(i)
        else:
            right.append(i)
    return quick_sort(left) + [pivot] + quick_sort(right)`,

  java: `public static List<Integer> quickSort(List<Integer> arr) {
    if (arr.size() <= 1) return arr;
    int pivot = arr.get(arr.size() - 1);
    List<Integer> left = new ArrayList<>();
    List<Integer> right = new ArrayList<>();
    for (int i = 0; i < arr.size() - 1; i++) {
      if (arr.get(i) < pivot) left.add(arr.get(i));
      else right.add(arr.get(i));
    }
    List<Integer> sorted = new ArrayList<>(quickSort(left));
    sorted.add(pivot);
    sorted.addAll(quickSort(right));
    return sorted;
  }`,

  cplusplus: `#include <vector>
std::vector<int> quickSort(const std::vector<int>& arr) {
  if (arr.size() <= 1) return arr;
  int pivot = arr.back();
  std::vector<int> left, right;
  for (size_t i = 0; i < arr.size() - 1; ++i) {
    if (arr[i] < pivot) left.push_back(arr[i]);
    else right.push_back(arr[i]);
  }
  std::vector<int> sorted = quickSort(left);
  sorted.push_back(pivot);
  std::vector<int> sortedRight = quickSort(right);
  sorted.insert(sorted.end(), sortedRight.begin(), sortedRight.end());
  return sorted;
}`,

  ruby: `def quick_sort(arr)
    return arr if arr.length <= 1
    pivot = arr[-1]
    left = []
    right = []
    arr[0...-1].each do |i|
      if i < pivot
        left << i
      else
        right << i
      end
    end
    quick_sort(left) + [pivot] + quick_sort(right)
  end`,

  csharp: `using System;
using System.Collections.Generic;

public static List<int> QuickSort(List<int> arr) {
  if (arr.Count <= 1) return arr;
  int pivot = arr[arr.Count - 1];
  List<int> left = new List<int>();
  List<int> right = new List<int>();
  for (int i = 0; i < arr.Count - 1; i++) {
    if (arr[i] < pivot) left.Add(arr[i]);
    else right.Add(arr[i]);
  }
  List<int> sorted = QuickSort(left);
  sorted.Add(pivot);
  sorted.AddRange(QuickSort(right));
  return sorted;
}`,

  go: `package main

import "fmt"

func quickSort(arr []int) []int {
  if len(arr) <= 1 {
    return arr
  }
  pivot := arr[len(arr)-1]
  left, right := []int{}, []int{}
  for _, v := range arr[:len(arr)-1] {
    if v < pivot {
      left = append(left, v)
    } else {
      right = append(right, v)
    }
  }
  sorted := append(quickSort(left), pivot)
  return append(sorted, quickSort(right)...)
}`,

  swift: `func quickSort(_ arr: [Int]) -> [Int] {
    guard arr.count > 1 else { return arr }
    let pivot = arr[arr.count - 1]
    let left = arr.dropLast().filter { $0 < pivot }
    let right = arr.dropLast().filter { $0 >= pivot }
    return quickSort(left) + [pivot] + quickSort(right)
}`
};


export default function TypingTest() {
  const [language, setLanguage] = useState<string>('javascript')
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState<number>(0)
  const [mistakes, setMistakes] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const codeToType = languages[language]

  useEffect(() => {
    if (currentIndex === codeToType.length) {
      if (!endTime) {
        setEndTime(Date.now())
      }
    } else if (currentIndex > 0 && !startTime) {
      setStartTime(Date.now())
    }
  }, [currentIndex, codeToType.length, startTime, endTime])

  useEffect(() => {
    if (startTime && endTime) {
      const timeInMinutes = (endTime - startTime) / 60000
      const wordsTyped = codeToType.trim().split(/\s+/).length
      setWpm(Math.round(wordsTyped / timeInMinutes))
    }
  }, [startTime, endTime, codeToType])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentChar = codeToType[currentIndex]

      if (!startTime && currentIndex === 0) {
        setStartTime(Date.now())
      }

      if (e.key === 'Tab') {
        e.preventDefault() // Prevent focus change
        if (currentChar === '\t') {
          setCurrentIndex(prev => prev + 1)
        } else {
          setMistakes(prev => prev + 1)
        }
      } else if (e.key === 'Enter') {
        e.preventDefault() // Prevent default behavior like form submission
        if (currentChar === '\n') {
          setCurrentIndex(prev => prev + 1)
        } else {
          setMistakes(prev => prev + 1)
        }
      } else if (e.key === currentChar) {
        setCurrentIndex(prev => prev + 1)
      } else if (e.key.length === 1) {
        setMistakes(prev => prev + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, codeToType, startTime])

  const handleReset = () => {
    setCurrentIndex(0)
    setStartTime(null)
    setEndTime(null)
    setWpm(0)
    setMistakes(0)
    containerRef.current?.focus()
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    handleReset()
  }

  const renderCode = () => {
    return codeToType.split('').map((char, index) => {
      let className = 'font-mono '
      if (index < currentIndex) {
        className += 'text-primary '
      } else if (index === currentIndex) {
        className += 'bg-primary/20 text-primary '
      } else {
        className += 'text-muted-foreground '
      }

      if (char === '\n') {
        if (index === currentIndex) {
          // Render a visible span for the current newline character
          return (
            <span
              key={index}
              className={className}
              style={{
                display: 'inline-block',
                width: '100%',
                height: '1em',
              }}
            >
              {'\u00A0'}
            </span>
          )
        } else {
          // For other newline characters, render a line break
          return <br key={index} />
        }
      } else if (char === '\t') {
        return (
          <span key={index} className={className}>
            {'\u00A0\u00A0\u00A0\u00A0'}
          </span>
        )
      } else {
        return (
          <span key={index} className={className}>
            {char}
          </span>
        )
      }
    })
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center h-screen">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl m-12">
      TypR: Accelerate Your Coding
    </h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Programmer Typing Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label htmlFor="language-select" className="block text-sm font-medium mb-1">
              Select Language
            </label>
            <Select onValueChange={handleLanguageChange} value={language}>
              <SelectTrigger id="language-select">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cplusplus">C++</SelectItem>
                <SelectItem value="ruby">Ruby</SelectItem>
                <SelectItem value="csharp">C#</SelectItem>
                <SelectItem value="go">Go</SelectItem>
                <SelectItem value="swift">Swift</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div
            ref={containerRef}
            tabIndex={0}
            className="mb-4 p-4 bg-card rounded-lg border min-h-[200px] focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <pre className="whitespace-pre-wrap">{renderCode()}</pre>
          </div>
          <div className="flex justify-between items-center">
            <div className="space-x-4">
              <Button onClick={handleReset}>Reset</Button>
              <span className="text-sm text-muted-foreground">
                Mistakes: {mistakes}
              </span>
            </div>
            <div className="text-xl font-bold">
              {wpm > 0 ? `${wpm} WPM` : 'Start typing...'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
