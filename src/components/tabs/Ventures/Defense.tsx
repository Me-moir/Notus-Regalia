"use client";

import { useEffect, useRef, useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
interface CountryInfo {
  name: string; iso: string; region: string;
  threat: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  partners: number; contracts: number;
}

interface Product {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  tag: string;
  stats: { label: string; value: string }[];
}

// ── Products (carousel) ────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: 'isr',
    eyebrow: 'SEC-01 // CONFIDENTIAL',
    title: 'Intelligence & Surveillance',
    subtitle: 'Advanced sensor fusion platforms enabling real-time battlefield awareness across contested environments. From satellite SIGINT to edge-deployed UAV networks.',
    tag: 'ISR',
    stats: [{ label: 'Portfolio Co.', value: '7' }, { label: 'Deployed', value: '14' }, { label: 'Avg. Round', value: '$28M' }],
  },
  {
    id: 'c2',
    eyebrow: 'SEC-02 // SECRET',
    title: 'Command & Control',
    subtitle: 'Resilient C2 infrastructure for degraded environments. Anti-jam SATCOM to tactical edge compute — communication that survives first contact with adversary forces.',
    tag: 'C2',
    stats: [{ label: 'Portfolio Co.', value: '5' }, { label: 'Contracts', value: '9' }, { label: 'Avg. Round', value: '$34M' }],
  },
  {
    id: 'cyber',
    eyebrow: 'SEC-04 // TOP SECRET',
    title: 'Cyber & Electronic Warfare',
    subtitle: 'Offensive and defensive capabilities across the electromagnetic spectrum. Zero-trust architectures protecting critical national infrastructure and classified networks.',
    tag: 'EW',
    stats: [{ label: 'Portfolio Co.', value: '6' }, { label: 'Patches', value: '3.2K+' }, { label: 'Avg. Round', value: '$22M' }],
  },
];

// ── Country data ───────────────────────────────────────────────────────────
const COUNTRY_DATA: Record<string, CountryInfo> = {
  'United States of America': { name: 'United States', iso: 'USA', region: 'NORTHAM', threat: 'LOW', partners: 47, contracts: 132 },
  'United Kingdom': { name: 'United Kingdom', iso: 'GBR', region: 'EUROPE', threat: 'LOW', partners: 18, contracts: 44 },
  'Germany': { name: 'Germany', iso: 'DEU', region: 'EUROPE', threat: 'LOW', partners: 12, contracts: 28 },
  'France': { name: 'France', iso: 'FRA', region: 'EUROPE', threat: 'LOW', partners: 9, contracts: 21 },
  'Russia': { name: 'Russia', iso: 'RUS', region: 'EURASIA', threat: 'CRITICAL', partners: 0, contracts: 0 },
  'China': { name: 'China', iso: 'CHN', region: 'INDOPAC', threat: 'CRITICAL', partners: 0, contracts: 0 },
  'Iran': { name: 'Iran', iso: 'IRN', region: 'MIDEAST', threat: 'HIGH', partners: 0, contracts: 0 },
  'North Korea': { name: 'North Korea', iso: 'PRK', region: 'INDOPAC', threat: 'CRITICAL', partners: 0, contracts: 0 },
  'Israel': { name: 'Israel', iso: 'ISR', region: 'MIDEAST', threat: 'LOW', partners: 14, contracts: 36 },
  'Japan': { name: 'Japan', iso: 'JPN', region: 'INDOPAC', threat: 'LOW', partners: 11, contracts: 24 },
  'South Korea': { name: 'South Korea', iso: 'KOR', region: 'INDOPAC', threat: 'LOW', partners: 8, contracts: 19 },
  'Australia': { name: 'Australia', iso: 'AUS', region: 'INDOPAC', threat: 'LOW', partners: 13, contracts: 31 },
  'India': { name: 'India', iso: 'IND', region: 'INDOPAC', threat: 'MEDIUM', partners: 5, contracts: 11 },
  'Pakistan': { name: 'Pakistan', iso: 'PAK', region: 'CENTASIA', threat: 'HIGH', partners: 1, contracts: 2 },
  'Saudi Arabia': { name: 'Saudi Arabia', iso: 'SAU', region: 'MIDEAST', threat: 'MEDIUM', partners: 6, contracts: 14 },
  'Turkey': { name: 'Turkey', iso: 'TUR', region: 'EUROPE', threat: 'MEDIUM', partners: 3, contracts: 7 },
  'Ukraine': { name: 'Ukraine', iso: 'UKR', region: 'EUROPE', threat: 'HIGH', partners: 4, contracts: 9 },
  'Poland': { name: 'Poland', iso: 'POL', region: 'EUROPE', threat: 'LOW', partners: 7, contracts: 16 },
  'Canada': { name: 'Canada', iso: 'CAN', region: 'NORTHAM', threat: 'LOW', partners: 15, contracts: 38 },
  'Brazil': { name: 'Brazil', iso: 'BRA', region: 'SOUTHAM', threat: 'LOW', partners: 3, contracts: 6 },
  'Italy': { name: 'Italy', iso: 'ITA', region: 'EUROPE', threat: 'LOW', partners: 7, contracts: 18 },
  'Spain': { name: 'Spain', iso: 'ESP', region: 'EUROPE', threat: 'LOW', partners: 6, contracts: 15 },
  'Norway': { name: 'Norway', iso: 'NOR', region: 'EUROPE', threat: 'LOW', partners: 4, contracts: 9 },
  'Sweden': { name: 'Sweden', iso: 'SWE', region: 'EUROPE', threat: 'LOW', partners: 5, contracts: 11 },
  'Denmark': { name: 'Denmark', iso: 'DNK', region: 'EUROPE', threat: 'LOW', partners: 4, contracts: 8 },
  'Belgium': { name: 'Belgium', iso: 'BEL', region: 'EUROPE', threat: 'LOW', partners: 3, contracts: 7 },
  'Netherlands': { name: 'Netherlands', iso: 'NLD', region: 'EUROPE', threat: 'LOW', partners: 5, contracts: 12 },
  'Switzerland': { name: 'Switzerland', iso: 'CHE', region: 'EUROPE', threat: 'LOW', partners: 2, contracts: 4 },
  'Austria': { name: 'Austria', iso: 'AUT', region: 'EUROPE', threat: 'LOW', partners: 2, contracts: 4 },
  'Greece': { name: 'Greece', iso: 'GRC', region: 'EUROPE', threat: 'LOW', partners: 3, contracts: 7 },
  'Portugal': { name: 'Portugal', iso: 'PRT', region: 'EUROPE', threat: 'LOW', partners: 2, contracts: 5 },
  'South Africa': { name: 'South Africa', iso: 'ZAF', region: 'AFRICA', threat: 'LOW', partners: 2, contracts: 4 },
  'Egypt': { name: 'Egypt', iso: 'EGY', region: 'MIDEAST', threat: 'MEDIUM', partners: 3, contracts: 7 },
  'Nigeria': { name: 'Nigeria', iso: 'NGA', region: 'AFRICA', threat: 'MEDIUM', partners: 1, contracts: 2 },
  'Argentina': { name: 'Argentina', iso: 'ARG', region: 'SOUTHAM', threat: 'LOW', partners: 2, contracts: 3 },
  'Mexico': { name: 'Mexico', iso: 'MEX', region: 'NORTHAM', threat: 'MEDIUM', partners: 3, contracts: 6 },
  'Indonesia': { name: 'Indonesia', iso: 'IDN', region: 'INDOPAC', threat: 'LOW', partners: 3, contracts: 6 },
  'Malaysia': { name: 'Malaysia', iso: 'MYS', region: 'INDOPAC', threat: 'LOW', partners: 2, contracts: 4 },
  'Singapore': { name: 'Singapore', iso: 'SGP', region: 'INDOPAC', threat: 'LOW', partners: 4, contracts: 9 },
  'Thailand': { name: 'Thailand', iso: 'THA', region: 'INDOPAC', threat: 'LOW', partners: 2, contracts: 5 },
  'Philippines': { name: 'Philippines', iso: 'PHL', region: 'INDOPAC', threat: 'LOW', partners: 3, contracts: 6 },
  'Vietnam': { name: 'Vietnam', iso: 'VNM', region: 'INDOPAC', threat: 'MEDIUM', partners: 1, contracts: 2 },
  'United Arab Emirates': { name: 'UAE', iso: 'ARE', region: 'MIDEAST', threat: 'LOW', partners: 5, contracts: 11 },
  'Qatar': { name: 'Qatar', iso: 'QAT', region: 'MIDEAST', threat: 'LOW', partners: 3, contracts: 6 },
  'Iraq': { name: 'Iraq', iso: 'IRQ', region: 'MIDEAST', threat: 'HIGH', partners: 0, contracts: 1 },
  'Syria': { name: 'Syria', iso: 'SYR', region: 'MIDEAST', threat: 'HIGH', partners: 0, contracts: 0 },
  'Kazakhstan': { name: 'Kazakhstan', iso: 'KAZ', region: 'CENTASIA', threat: 'MEDIUM', partners: 1, contracts: 2 },
  'Mongolia': { name: 'Mongolia', iso: 'MNG', region: 'INDOPAC', threat: 'LOW', partners: 1, contracts: 1 },
  'Ethiopia': { name: 'Ethiopia', iso: 'ETH', region: 'AFRICA', threat: 'MEDIUM', partners: 1, contracts: 2 },
  'Kenya': { name: 'Kenya', iso: 'KEN', region: 'AFRICA', threat: 'MEDIUM', partners: 1, contracts: 2 },
  'Ghana': { name: 'Ghana', iso: 'GHA', region: 'AFRICA', threat: 'LOW', partners: 1, contracts: 2 },
  'Tanzania': { name: 'Tanzania', iso: 'TZA', region: 'AFRICA', threat: 'LOW', partners: 1, contracts: 1 },
  'Morocco': { name: 'Morocco', iso: 'MAR', region: 'AFRICA', threat: 'LOW', partners: 2, contracts: 3 },
  'Algeria': { name: 'Algeria', iso: 'DZA', region: 'AFRICA', threat: 'MEDIUM', partners: 1, contracts: 1 },
  'Angola': { name: 'Angola', iso: 'AGO', region: 'AFRICA', threat: 'MEDIUM', partners: 1, contracts: 1 },
  'DR Congo': { name: 'DR Congo', iso: 'COD', region: 'AFRICA', threat: 'HIGH', partners: 0, contracts: 0 },
  'Myanmar': { name: 'Myanmar', iso: 'MMR', region: 'INDOPAC', threat: 'HIGH', partners: 0, contracts: 0 },
  'Cambodia': { name: 'Cambodia', iso: 'KHM', region: 'INDOPAC', threat: 'MEDIUM', partners: 1, contracts: 1 },
  'Laos': { name: 'Laos', iso: 'LAO', region: 'INDOPAC', threat: 'MEDIUM', partners: 0, contracts: 0 },
  'Bangladesh': { name: 'Bangladesh', iso: 'BGD', region: 'INDOPAC', threat: 'MEDIUM', partners: 1, contracts: 1 },
  'Sri Lanka': { name: 'Sri Lanka', iso: 'LKA', region: 'INDOPAC', threat: 'LOW', partners: 1, contracts: 1 },
  'Nepal': { name: 'Nepal', iso: 'NPL', region: 'INDOPAC', threat: 'LOW', partners: 0, contracts: 0 },
  'New Zealand': { name: 'New Zealand', iso: 'NZL', region: 'INDOPAC', threat: 'LOW', partners: 4, contracts: 8 },
  'Finland': { name: 'Finland', iso: 'FIN', region: 'EUROPE', threat: 'LOW', partners: 3, contracts: 6 },
  'Czech Republic': { name: 'Czech Republic', iso: 'CZE', region: 'EUROPE', threat: 'LOW', partners: 3, contracts: 5 },
  'Romania': { name: 'Romania', iso: 'ROU', region: 'EUROPE', threat: 'LOW', partners: 2, contracts: 4 },
  'Hungary': { name: 'Hungary', iso: 'HUN', region: 'EUROPE', threat: 'MEDIUM', partners: 1, contracts: 2 },
  'Chile': { name: 'Chile', iso: 'CHL', region: 'SOUTHAM', threat: 'LOW', partners: 2, contracts: 3 },
  'Colombia': { name: 'Colombia', iso: 'COL', region: 'SOUTHAM', threat: 'MEDIUM', partners: 2, contracts: 3 },
  'Peru': { name: 'Peru', iso: 'PER', region: 'SOUTHAM', threat: 'LOW', partners: 1, contracts: 2 },
  'Venezuela': { name: 'Venezuela', iso: 'VEN', region: 'SOUTHAM', threat: 'HIGH', partners: 0, contracts: 0 },
  'Jordan': { name: 'Jordan', iso: 'JOR', region: 'MIDEAST', threat: 'LOW', partners: 3, contracts: 6 },
  'Kuwait': { name: 'Kuwait', iso: 'KWT', region: 'MIDEAST', threat: 'LOW', partners: 2, contracts: 4 },
  'Oman': { name: 'Oman', iso: 'OMN', region: 'MIDEAST', threat: 'LOW', partners: 2, contracts: 3 },
  'Yemen': { name: 'Yemen', iso: 'YEM', region: 'MIDEAST', threat: 'CRITICAL', partners: 0, contracts: 0 },
  'Libya': { name: 'Libya', iso: 'LBY', region: 'AFRICA', threat: 'HIGH', partners: 0, contracts: 0 },
  'Sudan': { name: 'Sudan', iso: 'SDN', region: 'AFRICA', threat: 'HIGH', partners: 0, contracts: 0 },
};

const THREAT_COLORS: Record<string, string> = {
  LOW: '#00c853', MEDIUM: '#f5a623', HIGH: '#ff6b35', CRITICAL: '#E31B54',
};

// ── Capital city data ──────────────────────────────────────────────────────
interface Capital {
  name: string; country: string; lon: number; lat: number;
  leader: string; title: string; gov: string; iso: string;
  countryMapName?: string;
}

const CAPITALS: Capital[] = [
  // ── North America ──
  { name: 'Washington D.C.', country: 'United States', lon: -77.04, lat: 38.91, leader: 'Donald Trump', title: 'President', gov: 'Federal Republic', iso: 'USA', countryMapName: 'United States of America' },
  { name: 'Ottawa', country: 'Canada', lon: -75.70, lat: 45.42, leader: 'Mark Carney', title: 'Prime Minister', gov: 'Federal Parliamentary Monarchy', iso: 'CAN', countryMapName: 'Canada' },
  { name: 'Mexico City', country: 'Mexico', lon: -99.13, lat: 19.43, leader: 'Claudia Sheinbaum', title: 'President', gov: 'Federal Presidential Republic', iso: 'MEX', countryMapName: 'Mexico' },
  { name: 'Havana', country: 'Cuba', lon: -82.38, lat: 23.13, leader: 'Miguel Díaz-Canel', title: 'President', gov: 'Unitary One-Party State', iso: 'CUB' },
  { name: 'Guatemala City', country: 'Guatemala', lon: -90.52, lat: 14.64, leader: 'Bernardo Arévalo', title: 'President', gov: 'Presidential Republic', iso: 'GTM' },
  { name: 'San José', country: 'Costa Rica', lon: -84.09, lat: 9.93, leader: 'Rodrigo Chaves', title: 'President', gov: 'Presidential Republic', iso: 'CRI' },
  { name: 'Panama City', country: 'Panama', lon: -79.52, lat: 8.99, leader: 'José Raúl Mulino', title: 'President', gov: 'Presidential Republic', iso: 'PAN' },
  { name: 'Santo Domingo', country: 'Dominican Republic', lon: -69.90, lat: 18.48, leader: 'Luis Abinader', title: 'President', gov: 'Presidential Republic', iso: 'DOM' },

  // ── South America ──
  { name: 'Brasilia', country: 'Brazil', lon: -47.93, lat: -15.78, leader: 'Luiz Inácio Lula da Silva', title: 'President', gov: 'Federal Presidential Republic', iso: 'BRA', countryMapName: 'Brazil' },
  { name: 'Buenos Aires', country: 'Argentina', lon: -58.38, lat: -34.61, leader: 'Javier Milei', title: 'President', gov: 'Federal Presidential Republic', iso: 'ARG', countryMapName: 'Argentina' },
  { name: 'Santiago', country: 'Chile', lon: -70.67, lat: -33.45, leader: 'Gabriel Boric', title: 'President', gov: 'Presidential Republic', iso: 'CHL', countryMapName: 'Chile' },
  { name: 'Bogotá', country: 'Colombia', lon: -74.07, lat: 4.71, leader: 'Gustavo Petro', title: 'President', gov: 'Presidential Republic', iso: 'COL', countryMapName: 'Colombia' },
  { name: 'Lima', country: 'Peru', lon: -77.04, lat: -12.05, leader: 'Dina Boluarte', title: 'President', gov: 'Presidential Republic', iso: 'PER', countryMapName: 'Peru' },
  { name: 'Caracas', country: 'Venezuela', lon: -66.90, lat: 10.49, leader: 'Nicolás Maduro', title: 'President', gov: 'Presidential Republic', iso: 'VEN', countryMapName: 'Venezuela' },
  { name: 'Quito', country: 'Ecuador', lon: -78.52, lat: -0.23, leader: 'Daniel Noboa', title: 'President', gov: 'Presidential Republic', iso: 'ECU' },
  { name: 'La Paz', country: 'Bolivia', lon: -68.12, lat: -16.50, leader: 'Luis Arce', title: 'President', gov: 'Presidential Republic', iso: 'BOL' },

  // ── Europe ──
  { name: 'London', country: 'United Kingdom', lon: -0.12, lat: 51.51, leader: 'Keir Starmer', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'GBR', countryMapName: 'United Kingdom' },
  { name: 'Paris', country: 'France', lon: 2.35, lat: 48.85, leader: 'Emmanuel Macron', title: 'President', gov: 'Semi-Presidential Republic', iso: 'FRA', countryMapName: 'France' },
  { name: 'Berlin', country: 'Germany', lon: 13.38, lat: 52.52, leader: 'Friedrich Merz', title: 'Chancellor', gov: 'Federal Republic', iso: 'DEU', countryMapName: 'Germany' },
  { name: 'Rome', country: 'Italy', lon: 12.50, lat: 41.90, leader: 'Giorgia Meloni', title: 'Prime Minister', gov: 'Parliamentary Republic', iso: 'ITA', countryMapName: 'Italy' },
  { name: 'Madrid', country: 'Spain', lon: -3.70, lat: 40.42, leader: 'Pedro Sánchez', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'ESP', countryMapName: 'Spain' },
  { name: 'Amsterdam', country: 'Netherlands', lon: 4.90, lat: 52.37, leader: 'Dick Schoof', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'NLD', countryMapName: 'Netherlands' },
  { name: 'Brussels', country: 'Belgium', lon: 4.35, lat: 50.85, leader: 'Alexander De Croo', title: 'Prime Minister', gov: 'Federal Constitutional Monarchy', iso: 'BEL', countryMapName: 'Belgium' },
  { name: 'Bern', country: 'Switzerland', lon: 7.45, lat: 46.95, leader: 'Karin Keller-Sutter', title: 'President', gov: 'Federal Directorial Republic', iso: 'CHE', countryMapName: 'Switzerland' },
  { name: 'Vienna', country: 'Austria', lon: 16.37, lat: 48.21, leader: 'Herbert Kickl', title: 'Chancellor', gov: 'Federal Parliamentary Republic', iso: 'AUT', countryMapName: 'Austria' },
  { name: 'Stockholm', country: 'Sweden', lon: 18.07, lat: 59.33, leader: 'Ulf Kristersson', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'SWE', countryMapName: 'Sweden' },
  { name: 'Oslo', country: 'Norway', lon: 10.75, lat: 59.91, leader: 'Jonas Gahr Støre', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'NOR', countryMapName: 'Norway' },
  { name: 'Copenhagen', country: 'Denmark', lon: 12.57, lat: 55.68, leader: 'Mette Frederiksen', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'DNK', countryMapName: 'Denmark' },
  { name: 'Helsinki', country: 'Finland', lon: 25.00, lat: 60.17, leader: 'Alexander Stubb', title: 'President', gov: 'Semi-Presidential Republic', iso: 'FIN', countryMapName: 'Finland' },
  { name: 'Athens', country: 'Greece', lon: 23.73, lat: 37.98, leader: 'Kyriakos Mitsotakis', title: 'Prime Minister', gov: 'Parliamentary Republic', iso: 'GRC', countryMapName: 'Greece' },
  { name: 'Lisbon', country: 'Portugal', lon: -9.14, lat: 38.72, leader: 'Luís Montenegro', title: 'Prime Minister', gov: 'Semi-Presidential Republic', iso: 'PRT', countryMapName: 'Portugal' },
  { name: 'Warsaw', country: 'Poland', lon: 21.01, lat: 52.23, leader: 'Donald Tusk', title: 'Prime Minister', gov: 'Parliamentary Republic', iso: 'POL', countryMapName: 'Poland' },
  { name: 'Prague', country: 'Czech Republic', lon: 14.42, lat: 50.09, leader: 'Petr Pavel', title: 'President', gov: 'Parliamentary Republic', iso: 'CZE', countryMapName: 'Czech Republic' },
  { name: 'Budapest', country: 'Hungary', lon: 19.04, lat: 47.50, leader: 'Viktor Orbán', title: 'Prime Minister', gov: 'Parliamentary Republic', iso: 'HUN', countryMapName: 'Hungary' },
  { name: 'Bucharest', country: 'Romania', lon: 26.10, lat: 44.44, leader: 'Călin Georgescu', title: 'President', gov: 'Semi-Presidential Republic', iso: 'ROU', countryMapName: 'Romania' },
  { name: 'Kyiv', country: 'Ukraine', lon: 30.52, lat: 50.45, leader: 'Volodymyr Zelensky', title: 'President', gov: 'Semi-Presidential Republic', iso: 'UKR', countryMapName: 'Ukraine' },
  { name: 'Ankara', country: 'Turkey', lon: 32.86, lat: 39.93, leader: 'Recep Tayyip Erdoğan', title: 'President', gov: 'Presidential Republic', iso: 'TUR', countryMapName: 'Turkey' },

  // ── Russia / Eurasia ──
  { name: 'Moscow', country: 'Russia', lon: 37.62, lat: 55.75, leader: 'Vladimir Putin', title: 'President', gov: 'Federal Semi-Presidential Republic', iso: 'RUS', countryMapName: 'Russia' },
  { name: 'Astana', country: 'Kazakhstan', lon: 71.45, lat: 51.18, leader: 'Kassym-Jomart Tokayev', title: 'President', gov: 'Presidential Republic', iso: 'KAZ', countryMapName: 'Kazakhstan' },
  { name: 'Tbilisi', country: 'Georgia', lon: 44.83, lat: 41.69, leader: 'Mikheil Kavelashvili', title: 'President', gov: 'Parliamentary Republic', iso: 'GEO' },
  { name: 'Yerevan', country: 'Armenia', lon: 44.51, lat: 40.18, leader: 'Vahagn Khachaturyan', title: 'President', gov: 'Parliamentary Republic', iso: 'ARM' },
  { name: 'Baku', country: 'Azerbaijan', lon: 49.87, lat: 40.41, leader: 'Ilham Aliyev', title: 'President', gov: 'Presidential Republic', iso: 'AZE' },
  { name: 'Tashkent', country: 'Uzbekistan', lon: 69.27, lat: 41.30, leader: 'Shavkat Mirziyoyev', title: 'President', gov: 'Presidential Republic', iso: 'UZB' },
  { name: 'Bishkek', country: 'Kyrgyzstan', lon: 74.60, lat: 42.87, leader: 'Sadyr Japarov', title: 'President', gov: 'Presidential Republic', iso: 'KGZ' },
  { name: 'Dushanbe', country: 'Tajikistan', lon: 68.78, lat: 38.56, leader: 'Emomali Rahmon', title: 'President', gov: 'Presidential Republic', iso: 'TJK' },
  { name: 'Ashgabat', country: 'Turkmenistan', lon: 58.38, lat: 37.95, leader: 'Serdar Berdimuhamedow', title: 'President', gov: 'Presidential Republic', iso: 'TKM' },
  { name: 'Ulaanbaatar', country: 'Mongolia', lon: 106.91, lat: 47.89, leader: 'Luvsannamsrain Oyun-Erdene', title: 'Prime Minister', gov: 'Parliamentary Republic', iso: 'MNG', countryMapName: 'Mongolia' },

  // ── Middle East ──
  { name: 'Beijing', country: 'China', lon: 116.39, lat: 39.91, leader: 'Xi Jinping', title: 'General Secretary', gov: 'Unitary One-Party State', iso: 'CHN', countryMapName: 'China' },
  { name: 'Tehran', country: 'Iran', lon: 51.42, lat: 35.69, leader: 'Masoud Pezeshkian', title: 'President', gov: 'Theocratic Republic', iso: 'IRN', countryMapName: 'Iran' },
  { name: 'Riyadh', country: 'Saudi Arabia', lon: 46.72, lat: 24.69, leader: 'Mohammed bin Salman', title: 'Prime Minister', gov: 'Absolute Monarchy', iso: 'SAU', countryMapName: 'Saudi Arabia' },
  { name: 'Abu Dhabi', country: 'UAE', lon: 54.37, lat: 24.45, leader: 'Mohamed bin Zayed', title: 'President', gov: 'Federal Monarchy', iso: 'ARE', countryMapName: 'United Arab Emirates' },
  { name: 'Doha', country: 'Qatar', lon: 51.53, lat: 25.29, leader: 'Tamim bin Hamad Al Thani', title: 'Emir', gov: 'Constitutional Monarchy', iso: 'QAT', countryMapName: 'Qatar' },
  { name: 'Kuwait City', country: 'Kuwait', lon: 47.98, lat: 29.37, leader: 'Mishal Al-Ahmad Al-Sabah', title: 'Emir', gov: 'Constitutional Monarchy', iso: 'KWT', countryMapName: 'Kuwait' },
  { name: 'Muscat', country: 'Oman', lon: 58.59, lat: 23.61, leader: 'Haitham bin Tariq', title: 'Sultan', gov: 'Absolute Monarchy', iso: 'OMN', countryMapName: 'Oman' },
  { name: 'Amman', country: 'Jordan', lon: 35.93, lat: 31.96, leader: 'Abdullah II', title: 'King', gov: 'Constitutional Monarchy', iso: 'JOR', countryMapName: 'Jordan' },
  { name: 'Tel Aviv', country: 'Israel', lon: 34.78, lat: 32.08, leader: 'Benjamin Netanyahu', title: 'Prime Minister', gov: 'Parliamentary Republic', iso: 'ISR', countryMapName: 'Israel' },
  { name: 'Baghdad', country: 'Iraq', lon: 44.36, lat: 33.34, leader: 'Mohammed Shia Al-Sudani', title: 'Prime Minister', gov: 'Federal Parliamentary Republic', iso: 'IRQ', countryMapName: 'Iraq' },
  { name: 'Damascus', country: 'Syria', lon: 36.29, lat: 33.51, leader: 'Ahmad al-Sharaa', title: 'President', gov: 'Transitional Government', iso: 'SYR', countryMapName: 'Syria' },
  { name: 'Beirut', country: 'Lebanon', lon: 35.50, lat: 33.89, leader: 'Joseph Aoun', title: 'President', gov: 'Parliamentary Republic', iso: 'LBN' },
  { name: "Sana'a", country: 'Yemen', lon: 44.21, lat: 15.35, leader: 'Rashad al-Alimi', title: 'President', gov: 'Transitional Government', iso: 'YEM', countryMapName: 'Yemen' },

  // ── South Asia ──
  { name: 'New Delhi', country: 'India', lon: 77.21, lat: 28.61, leader: 'Narendra Modi', title: 'Prime Minister', gov: 'Federal Parliamentary Republic', iso: 'IND', countryMapName: 'India' },
  { name: 'Islamabad', country: 'Pakistan', lon: 73.04, lat: 33.72, leader: 'Shehbaz Sharif', title: 'Prime Minister', gov: 'Federal Parliamentary Republic', iso: 'PAK', countryMapName: 'Pakistan' },
  { name: 'Dhaka', country: 'Bangladesh', lon: 90.41, lat: 23.72, leader: 'Muhammad Yunus', title: 'Chief Adviser', gov: 'Parliamentary Republic', iso: 'BGD', countryMapName: 'Bangladesh' },
  { name: 'Colombo', country: 'Sri Lanka', lon: 79.86, lat: 6.93, leader: 'Anura Kumara Dissanayake', title: 'President', gov: 'Presidential Republic', iso: 'LKA', countryMapName: 'Sri Lanka' },
  { name: 'Kathmandu', country: 'Nepal', lon: 85.32, lat: 27.72, leader: 'KP Sharma Oli', title: 'Prime Minister', gov: 'Federal Parliamentary Republic', iso: 'NPL', countryMapName: 'Nepal' },
  { name: 'Kabul', country: 'Afghanistan', lon: 69.18, lat: 34.53, leader: 'Hibatullah Akhundzada', title: 'Supreme Leader', gov: 'Theocratic Emirate', iso: 'AFG' },

  // ── East Asia ──
  { name: 'Tokyo', country: 'Japan', lon: 139.69, lat: 35.69, leader: 'Sanae Takaichi', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'JPN', countryMapName: 'Japan' },
  { name: 'Seoul', country: 'South Korea', lon: 126.98, lat: 37.57, leader: 'Lee Jae-myung', title: 'President', gov: 'Unitary Presidential Republic', iso: 'KOR', countryMapName: 'South Korea' },
  { name: 'Pyongyang', country: 'North Korea', lon: 125.73, lat: 39.02, leader: 'Kim Jong-un', title: 'Supreme Leader', gov: 'Unitary One-Party State', iso: 'PRK', countryMapName: 'North Korea' },
  { name: 'Taipei', country: 'Taiwan', lon: 121.56, lat: 25.04, leader: 'Lai Ching-te', title: 'President', gov: 'Semi-Presidential Republic', iso: 'TWN' },

  // ── Southeast Asia ──
  { name: 'Manila', country: 'Philippines', lon: 120.98, lat: 14.60, leader: 'Ferdinand Marcos Jr.', title: 'President', gov: 'Presidential Republic', iso: 'PHL', countryMapName: 'Philippines' },
  { name: 'Jakarta', country: 'Indonesia', lon: 106.82, lat: -6.17, leader: 'Prabowo Subianto', title: 'President', gov: 'Presidential Republic', iso: 'IDN', countryMapName: 'Indonesia' },
  { name: 'Kuala Lumpur', country: 'Malaysia', lon: 101.69, lat: 3.14, leader: 'Anwar Ibrahim', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'MYS', countryMapName: 'Malaysia' },
  { name: 'Singapore', country: 'Singapore', lon: 103.82, lat: 1.35, leader: 'Lawrence Wong', title: 'Prime Minister', gov: 'Parliamentary Republic', iso: 'SGP', countryMapName: 'Singapore' },
  { name: 'Bangkok', country: 'Thailand', lon: 100.50, lat: 13.75, leader: 'Paetongtarn Shinawatra', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'THA', countryMapName: 'Thailand' },
  { name: 'Hanoi', country: 'Vietnam', lon: 105.85, lat: 21.03, leader: 'Tô Lâm', title: 'General Secretary', gov: 'Unitary One-Party State', iso: 'VNM', countryMapName: 'Vietnam' },
  { name: 'Naypyidaw', country: 'Myanmar', lon: 96.13, lat: 19.75, leader: 'Min Aung Hlaing', title: 'Prime Minister', gov: 'Military Junta', iso: 'MMR', countryMapName: 'Myanmar' },
  { name: 'Phnom Penh', country: 'Cambodia', lon: 104.92, lat: 11.56, leader: 'Hun Manet', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'KHM', countryMapName: 'Cambodia' },
  { name: 'Vientiane', country: 'Laos', lon: 102.60, lat: 17.97, leader: 'Sonexay Siphandon', title: 'Prime Minister', gov: 'Unitary One-Party State', iso: 'LAO', countryMapName: 'Laos' },
  { name: 'Bandar Seri Begawan', country: 'Brunei', lon: 114.94, lat: 4.94, leader: 'Hassanal Bolkiah', title: 'Sultan', gov: 'Absolute Monarchy', iso: 'BRN' },
  { name: 'Dili', country: 'Timor-Leste', lon: 125.58, lat: -8.56, leader: 'Kay Rala Xanana Gusmão', title: 'Prime Minister', gov: 'Semi-Presidential Republic', iso: 'TLS' },

  // ── Oceania ──
  { name: 'Canberra', country: 'Australia', lon: 149.13, lat: -35.28, leader: 'Anthony Albanese', title: 'Prime Minister', gov: 'Federal Parliamentary Monarchy', iso: 'AUS', countryMapName: 'Australia' },
  { name: 'Wellington', country: 'New Zealand', lon: 174.78, lat: -41.29, leader: 'Christopher Luxon', title: 'Prime Minister', gov: 'Parliamentary Monarchy', iso: 'NZL', countryMapName: 'New Zealand' },
  { name: 'Port Moresby', country: 'Papua New Guinea', lon: 147.19, lat: -9.44, leader: 'James Marape', title: 'Prime Minister', gov: 'Parliamentary Monarchy', iso: 'PNG' },

  // ── Africa ──
  { name: 'Pretoria', country: 'South Africa', lon: 28.19, lat: -25.75, leader: 'Cyril Ramaphosa', title: 'President', gov: 'Constitutional Republic', iso: 'ZAF', countryMapName: 'South Africa' },
  { name: 'Cairo', country: 'Egypt', lon: 31.24, lat: 30.04, leader: 'Abdel Fattah el-Sisi', title: 'President', gov: 'Presidential Republic', iso: 'EGY', countryMapName: 'Egypt' },
  { name: 'Abuja', country: 'Nigeria', lon: 7.49, lat: 9.06, leader: 'Bola Tinubu', title: 'President', gov: 'Federal Presidential Republic', iso: 'NGA', countryMapName: 'Nigeria' },
  { name: 'Addis Ababa', country: 'Ethiopia', lon: 38.74, lat: 9.03, leader: 'Abiy Ahmed', title: 'Prime Minister', gov: 'Federal Parliamentary Republic', iso: 'ETH', countryMapName: 'Ethiopia' },
  { name: 'Nairobi', country: 'Kenya', lon: 36.82, lat: -1.29, leader: 'William Ruto', title: 'President', gov: 'Presidential Republic', iso: 'KEN', countryMapName: 'Kenya' },
  { name: 'Accra', country: 'Ghana', lon: -0.19, lat: 5.56, leader: 'John Mahama', title: 'President', gov: 'Presidential Republic', iso: 'GHA', countryMapName: 'Ghana' },
  { name: 'Dar es Salaam', country: 'Tanzania', lon: 39.29, lat: -6.79, leader: 'Samia Suluhu Hassan', title: 'President', gov: 'Presidential Republic', iso: 'TZA', countryMapName: 'Tanzania' },
  { name: 'Rabat', country: 'Morocco', lon: -6.85, lat: 34.01, leader: 'Aziz Akhannouch', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'MAR', countryMapName: 'Morocco' },
  { name: 'Algiers', country: 'Algeria', lon: 3.06, lat: 36.74, leader: 'Abdelmadjid Tebboune', title: 'President', gov: 'Presidential Republic', iso: 'DZA', countryMapName: 'Algeria' },
  { name: 'Luanda', country: 'Angola', lon: 13.23, lat: -8.84, leader: 'João Lourenço', title: 'President', gov: 'Presidential Republic', iso: 'AGO', countryMapName: 'Angola' },
  { name: 'Kinshasa', country: 'DR Congo', lon: 15.32, lat: -4.32, leader: 'Félix Tshisekedi', title: 'President', gov: 'Presidential Republic', iso: 'COD', countryMapName: 'DR Congo' },
  { name: 'Khartoum', country: 'Sudan', lon: 32.53, lat: 15.55, leader: 'Abdel Fattah al-Burhan', title: 'Chairman', gov: 'Military Council', iso: 'SDN', countryMapName: 'Sudan' },
  { name: 'Tripoli', country: 'Libya', lon: 13.19, lat: 32.90, leader: 'Abdul Hamid Dbeibeh', title: 'Prime Minister', gov: 'Transitional Government', iso: 'LBY', countryMapName: 'Libya' },
  { name: 'Dakar', country: 'Senegal', lon: -17.45, lat: 14.73, leader: 'Bassirou Diomaye Faye', title: 'President', gov: 'Presidential Republic', iso: 'SEN' },
  { name: 'Kampala', country: 'Uganda', lon: 32.58, lat: 0.32, leader: 'Yoweri Museveni', title: 'President', gov: 'Presidential Republic', iso: 'UGA' },
  { name: 'Harare', country: 'Zimbabwe', lon: 31.05, lat: -17.83, leader: 'Emmerson Mnangagwa', title: 'President', gov: 'Presidential Republic', iso: 'ZWE' },
  { name: 'Tunis', country: 'Tunisia', lon: 10.18, lat: 36.82, leader: 'Kais Saied', title: 'President', gov: 'Presidential Republic', iso: 'TUN' },
  { name: 'Mogadishu', country: 'Somalia', lon: 45.34, lat: 2.05, leader: 'Hassan Sheikh Mohamud', title: 'President', gov: 'Federal Parliamentary Republic', iso: 'SOM' },
  { name: "N'Djamena", country: 'Chad', lon: 15.04, lat: 12.11, leader: 'Mahamat Déby', title: 'President', gov: 'Presidential Republic', iso: 'TCD' },
  { name: 'Bamako', country: 'Mali', lon: -8.00, lat: 12.65, leader: 'Assimi Goïta', title: 'President', gov: 'Military Junta', iso: 'MLI' },
  { name: 'Maputo', country: 'Mozambique', lon: 32.59, lat: -25.97, leader: 'Daniel Chapo', title: 'President', gov: 'Presidential Republic', iso: 'MOZ' },
  { name: 'Lusaka', country: 'Zambia', lon: 28.28, lat: -15.42, leader: 'Hakainde Hichilema', title: 'President', gov: 'Presidential Republic', iso: 'ZMB' },
];

// ISS Tooltip data
const ISS_INFO = {
  fullName: 'International Space Station',
  altitude: '408 km',
  speed: '27,600 km/h',
  countries: ['United States', 'Russia', 'Japan', 'Canada', 'Belgium', 'Denmark', 'France', 'Germany', 'Italy', 'Netherlands', 'Norway', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom'],
  launched: '1998',
  crewCapacity: '7',
};

// ── Beacon tooltip interface ───────────────────────────────────────────────
interface BeaconTooltip {
  capital: Capital;
  x: number;
  y: number;
}

interface ISSTooltip {
  x: number;
  y: number;
}

// ── Globe theme tokens ─────────────────────────────────────────────────────
interface GlobeTheme {
  ocean0: string; ocean50: string; ocean100: string;
  spec0: string; spec100: string;
  atm96: string; atm100: string;
  starFill: string; starMaxOpacity: number;
  hexStroke: string;
  gratF: string; gratM: string;
  equatorStroke: string; tropicStroke: string;
  scanStroke: string;
  landKnown: string; landUnknown: string;
  landKnownStroke: string; landUnknownStroke: string;
  landHoverFill: string; landHoverStroke: string;
  landSelectedFill: string;
  borderStroke: string;
  ring1: string; ring2: string; ring3: string;
  tickCardinal: string; tickMajor: string; tickMinor: string;
  poleStroke: string; poleDot: string;
  issColor: string; issTrack: string;
  beaconDot: string; beaconPulse: string;
  tooltipBg: string; tooltipBorder: string; tooltipAccent: string;
  tooltipText: string; tooltipSubtext: string; tooltipMeta: string;
  hudText: string; hudBracket: string;
  bgGrid: string; panelBg: string;
}

const DARK_THEME: GlobeTheme = {
  ocean0: '#0d1017', ocean50: '#08090d', ocean100: '#030405',
  spec0: '#1c2535', spec100: '#0a0c12',
  atm96: '#7a8fa8', atm100: '#9bb0c4',
  starFill: '#dde8f0', starMaxOpacity: 0.28,
  hexStroke: 'rgba(140,165,200,0.048)',
  gratF: 'rgba(120,140,170,0.03)', gratM: 'rgba(150,170,200,0.065)',
  equatorStroke: 'rgba(227,27,84,0.13)', tropicStroke: 'rgba(160,175,195,0.03)',
  scanStroke: 'rgba(227,27,84,0.4)',
  landKnown: 'rgba(24,29,40,0.92)', landUnknown: 'rgba(18,21,30,0.88)',
  landKnownStroke: 'rgba(110,130,165,0.22)', landUnknownStroke: 'rgba(70,85,110,0.1)',
  landHoverFill: 'rgba(155,180,215,0.25)', landHoverStroke: 'rgba(220,235,255,1.0)',
  landSelectedFill: 'rgba(227,27,84,0.18)',
  borderStroke: 'rgba(130,155,190,0.18)',
  ring1: 'rgba(140,160,185,0.1)', ring2: 'rgba(120,140,170,0.07)', ring3: 'rgba(227,27,84,0.12)',
  tickCardinal: 'rgba(227,27,84,0.65)', tickMajor: 'rgba(150,170,200,0.28)', tickMinor: 'rgba(110,130,160,0.1)',
  poleStroke: 'rgba(227,27,84,0.3)', poleDot: 'rgba(227,27,84,0.5)',
  issColor: '#00dcff', issTrack: 'rgba(0,220,255,0.18)',
  beaconDot: '#00c8ff', beaconPulse: 'rgba(0,200,255,0.5)',
  tooltipBg: 'rgba(3,6,12,0.96)', tooltipBorder: 'rgba(0,200,255,0.14)',
  tooltipAccent: 'rgba(0,200,255,0.55)', tooltipText: 'rgba(255,255,255,0.94)',
  tooltipSubtext: 'rgba(255,255,255,0.72)', tooltipMeta: 'rgba(255,255,255,0.22)',
  hudText: 'rgba(130,155,185,0.28)', hudBracket: 'rgba(227,27,84,0.35)',
  bgGrid: 'rgba(120,145,175,0.03)', panelBg: '#010308',
};

const LIGHT_THEME: GlobeTheme = {
  ocean0: '#f8f9fa', ocean50: '#f0f2f4', ocean100: '#e8eaec',
  spec0: '#ffffff', spec100: '#e0e4e8',
  atm96: '#c0c8d0', atm100: '#a0aab4',
  starFill: '#c0c8d0', starMaxOpacity: 0.0,
  hexStroke: 'rgba(80,90,100,0.055)',
  gratF: 'rgba(60,70,80,0.07)', gratM: 'rgba(60,70,80,0.15)',
  equatorStroke: 'rgba(227,27,84,0.28)', tropicStroke: 'rgba(60,70,80,0.06)',
  scanStroke: 'rgba(227,27,84,0.38)',
  landKnown: 'rgba(208,212,216,0.97)', landUnknown: 'rgba(190,195,200,0.90)',
  landKnownStroke: 'rgba(90,100,112,0.3)', landUnknownStroke: 'rgba(90,100,112,0.13)',
  landHoverFill: 'rgba(155,165,175,0.97)', landHoverStroke: 'rgba(30,40,55,0.85)',
  landSelectedFill: 'rgba(227,27,84,0.1)',
  borderStroke: 'rgba(80,90,102,0.22)',
  ring1: 'rgba(80,90,100,0.12)', ring2: 'rgba(80,90,100,0.07)', ring3: 'rgba(227,27,84,0.14)',
  tickCardinal: 'rgba(227,27,84,0.7)', tickMajor: 'rgba(70,80,90,0.35)', tickMinor: 'rgba(70,80,90,0.14)',
  poleStroke: 'rgba(227,27,84,0.4)', poleDot: 'rgba(227,27,84,0.6)',
  issColor: '#00c8ff', issTrack: 'rgba(0,200,255,0.2)',
  beaconDot: '#00c8ff', beaconPulse: 'rgba(0,200,255,0.5)',
  tooltipBg: 'rgba(248,249,250,0.97)', tooltipBorder: 'rgba(0,200,255,0.18)',
  tooltipAccent: 'rgba(0,200,255,0.65)', tooltipText: 'rgba(15,18,22,0.92)',
  tooltipSubtext: 'rgba(15,18,22,0.62)', tooltipMeta: 'rgba(15,18,22,0.36)',
  hudText: 'rgba(70,80,90,0.42)', hudBracket: 'rgba(227,27,84,0.4)',
  bgGrid: 'rgba(60,70,80,0.045)', panelBg: '#f4f5f6',
};

// ── Hook: sync with site-wide night/light mode ─────────────────────────────
function useSiteThemeIsLight(): boolean {
  const [isLight, setIsLight] = useState(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('light');
  });

  useEffect(() => {
    const root = document.documentElement;
    setIsLight(root.classList.contains('light'));
    const observer = new MutationObserver(() => {
      setIsLight(root.classList.contains('light'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isLight;
}

// ── Globe ──────────────────────────────────────────────────────────────────
const GlobeD3 = ({ onCountrySelect, theme }: { onCountrySelect: (info: CountryInfo | null) => void; theme: GlobeTheme }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{ issT: number; selected: string | null; hoveredCountry: string | null }>({ issT: 0, selected: null, hoveredCountry: null });
  const themeRef = useRef<GlobeTheme>(theme);
  useEffect(() => { themeRef.current = theme; }, [theme]);

  // Imperatively re-skin the SVG whenever theme changes
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const t = theme;

    const oceanStops = svg.querySelectorAll('#def-ocean stop');
    if (oceanStops[0]) (oceanStops[0] as SVGStopElement).style.stopColor = t.ocean0;
    if (oceanStops[1]) (oceanStops[1] as SVGStopElement).style.stopColor = t.ocean50;
    if (oceanStops[2]) (oceanStops[2] as SVGStopElement).style.stopColor = t.ocean100;

    const specStops = svg.querySelectorAll('#def-spec stop');
    if (specStops[0]) (specStops[0] as SVGStopElement).style.stopColor = t.spec0;
    if (specStops[1]) (specStops[1] as SVGStopElement).style.stopColor = t.spec100;

    const atmStops = svg.querySelectorAll('#def-atm stop');
    if (atmStops[1]) (atmStops[1] as SVGStopElement).style.stopColor = t.atm96;
    if (atmStops[2]) (atmStops[2] as SVGStopElement).style.stopColor = t.atm100;

    svg.querySelectorAll('.star-pt').forEach((el) => {
      const s = el as SVGCircleElement;
      s.style.fill = t.starFill;
      const baseO = parseFloat(s.dataset.baseO ?? '0.15');
      s.style.opacity = String(baseO * (t.starMaxOpacity / 0.28));
    });

    const gf = svg.querySelector('.grat-f') as SVGPathElement | null;
    const gm = svg.querySelector('.grat-m') as SVGPathElement | null;
    const eq = svg.querySelector('.equator') as SVGPathElement | null;
    if (gf) gf.style.stroke = t.gratF;
    if (gm) gm.style.stroke = t.gratM;
    if (eq) eq.style.stroke = t.equatorStroke;
    svg.querySelectorAll('[class^="tropic-"]').forEach(el => {
      (el as SVGPathElement).style.stroke = t.tropicStroke;
    });

    const sr = svg.querySelector('.scan-ring') as SVGCircleElement | null;
    if (sr) sr.style.stroke = t.scanStroke;

    svg.querySelectorAll('.country').forEach(el => {
      const p = el as SVGPathElement;
      const name = (p as any).__countryName;
      const isSel = stateRef.current.selected === name;
      const isHov = stateRef.current.hoveredCountry === name;
      if (isSel) return;
      if (isHov) {
        p.style.fill = t.landHoverFill;
        p.style.stroke = t.landHoverStroke;
        return;
      }
      const hasData = p.dataset.hasData === 'true';
      p.style.fill = hasData ? t.landKnown : t.landUnknown;
      p.style.stroke = hasData ? t.landKnownStroke : t.landUnknownStroke;
    });

    const borders = svg.querySelector('.borders') as SVGPathElement | null;
    if (borders) borders.style.stroke = t.borderStroke;

    svg.querySelectorAll('[data-ring]').forEach(el => {
      const idx = (el as SVGCircleElement).dataset.ring;
      const c = idx === '1' ? t.ring1 : idx === '2' ? t.ring2 : t.ring3;
      (el as SVGCircleElement).style.stroke = c;
    });

    svg.querySelectorAll('[data-tick]').forEach(el => {
      const kind = (el as SVGLineElement).dataset.tick;
      const c = kind === 'cardinal' ? t.tickCardinal : kind === 'major' ? t.tickMajor : t.tickMinor;
      (el as SVGLineElement).style.stroke = c;
    });

    svg.querySelectorAll('[data-pole-line]').forEach(el => {
      (el as SVGLineElement).style.stroke = t.poleStroke;
    });
    const poleDot = svg.querySelector('[data-pole-dot]') as SVGCircleElement | null;
    if (poleDot) poleDot.style.stroke = t.poleDot;

    const issTrack = svg.querySelector('.iss-track') as SVGPathElement | null;
    if (issTrack) issTrack.style.stroke = t.issTrack;
    svg.querySelectorAll('.iss-group line').forEach(el => {
      (el as SVGLineElement).style.stroke = t.issColor;
    });
    svg.querySelectorAll('.iss-group circle').forEach((el, i) => {
      const c = el as SVGCircleElement;
      if (i === 0) { c.style.fill = t.issColor; c.style.stroke = 'none'; }
      else { c.style.fill = 'none'; c.style.stroke = t.issColor; }
    });
    const issText = svg.querySelector('.iss-group text') as SVGTextElement | null;
    if (issText) issText.style.fill = t.issColor;

    svg.querySelectorAll('.beacon-pulse').forEach(el => {
      (el as SVGCircleElement).style.stroke = t.beaconPulse;
    });
    svg.querySelectorAll('[data-beacon-dot]').forEach(el => {
      (el as SVGCircleElement).style.fill = t.beaconDot;
    });
  }, [theme]);

  const [isLoading, setIsLoading] = useState(true);
  const [tooltip, setTooltip] = useState<BeaconTooltip | null>(null);
  const [issTooltip, setIssTooltip] = useState<ISSTooltip | null>(null);

  useEffect(() => {
    let d3: any, topojson: any;
    let mounted = true;
    let animFrame: number;
    let isDragging = false;
    let lastX = 0, lastY = 0;
    let rotation = [-20, -28, 0];
    const autoRotate = true;

    const loadAndInit = async () => {
      const theme = themeRef.current;
      await Promise.all([
        new Promise<void>(res => {
          if ((window as any).d3) { d3 = (window as any).d3; res(); return; }
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js';
          s.onload = () => { d3 = (window as any).d3; res(); };
          document.head.appendChild(s);
        }),
        new Promise<void>(res => {
          if ((window as any).topojson) { topojson = (window as any).topojson; res(); return; }
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js';
          s.onload = () => { topojson = (window as any).topojson; res(); };
          document.head.appendChild(s);
        }),
      ]);
      if (!mounted) return;

      const world = await fetch('/world-110m.json').then(r => r.json());
      const countriesGeo = topojson.feature(world, world.objects.countries);
      const bordersGeo = topojson.mesh(world, world.objects.countries, (a: any, b: any) => a !== b);

      const ID_TO_NAME: Record<number, string> = {
        // North America
        840: 'United States of America', 124: 'Canada', 484: 'Mexico',
        192: 'Cuba', 320: 'Guatemala', 340: 'Honduras', 222: 'El Salvador',
        558: 'Nicaragua', 188: 'Costa Rica', 591: 'Panama',
        214: 'Dominican Republic', 332: 'Haiti', 630: 'Puerto Rico',
        // South America
        76: 'Brazil', 32: 'Argentina', 152: 'Chile', 170: 'Colombia',
        604: 'Peru', 862: 'Venezuela', 218: 'Ecuador', 68: 'Bolivia',
        600: 'Paraguay', 858: 'Uruguay', 328: 'Guyana', 740: 'Suriname',
        // Europe
        826: 'United Kingdom', 250: 'France', 276: 'Germany', 380: 'Italy',
        724: 'Spain', 528: 'Netherlands', 56: 'Belgium', 756: 'Switzerland',
        40: 'Austria', 752: 'Sweden', 578: 'Norway', 208: 'Denmark',
        246: 'Finland', 300: 'Greece', 620: 'Portugal', 616: 'Poland',
        203: 'Czech Republic', 348: 'Hungary', 642: 'Romania', 804: 'Ukraine',
        792: 'Turkey', 703: 'Slovakia', 705: 'Slovenia', 191: 'Croatia',
        688: 'Serbia', 100: 'Bulgaria', 498: 'Moldova', 112: 'Belarus',
        807: 'North Macedonia', 8: 'Albania', 70: 'Bosnia and Herzegovina',
        499: 'Montenegro', 352: 'Iceland', 372: 'Ireland', 470: 'Malta',
        442: 'Luxembourg', 233: 'Estonia', 428: 'Latvia', 440: 'Lithuania',
        // Russia / Eurasia
        643: 'Russia', 398: 'Kazakhstan', 268: 'Georgia', 51: 'Armenia',
        31: 'Azerbaijan', 860: 'Uzbekistan', 417: 'Kyrgyzstan',
        762: 'Tajikistan', 795: 'Turkmenistan', 496: 'Mongolia',
        // Middle East
        156: 'China', 364: 'Iran', 682: 'Saudi Arabia', 784: 'United Arab Emirates',
        634: 'Qatar', 414: 'Kuwait', 512: 'Oman', 400: 'Jordan',
        376: 'Israel', 275: 'Palestine', 368: 'Iraq', 760: 'Syria',
        422: 'Lebanon', 887: 'Yemen', 48: 'Bahrain',
        // South Asia
        356: 'India', 586: 'Pakistan', 50: 'Bangladesh', 144: 'Sri Lanka',
        524: 'Nepal', 64: 'Bhutan', 462: 'Maldives', 4: 'Afghanistan',
        // East Asia
        392: 'Japan', 410: 'South Korea', 408: 'North Korea',
        158: 'Taiwan',
        // Southeast Asia
        608: 'Philippines', 360: 'Indonesia', 458: 'Malaysia',
        702: 'Singapore', 764: 'Thailand', 704: 'Vietnam', 104: 'Myanmar',
        116: 'Cambodia', 418: 'Laos', 96: 'Brunei', 626: 'Timor-Leste',
        // Oceania
        36: 'Australia', 554: 'New Zealand', 598: 'Papua New Guinea',
        242: 'Fiji', 90: 'Solomon Islands',
        // Africa
        710: 'South Africa', 818: 'Egypt', 566: 'Nigeria', 231: 'Ethiopia',
        404: 'Kenya', 288: 'Ghana', 834: 'Tanzania', 504: 'Morocco',
        12: 'Algeria', 24: 'Angola', 180: 'DR Congo', 729: 'Sudan',
        434: 'Libya', 686: 'Senegal', 800: 'Uganda', 716: 'Zimbabwe',
        788: 'Tunisia', 706: 'Somalia', 148: 'Chad', 466: 'Mali',
        508: 'Mozambique', 894: 'Zambia', 454: 'Malawi', 854: 'Burkina Faso',
        120: 'Cameroon', 204: 'Benin', 384: 'Ivory Coast', 266: 'Gabon',
        624: 'Guinea-Bissau', 324: 'Guinea', 430: 'Liberia', 478: 'Mauritania',
        562: 'Niger', 694: 'Sierra Leone', 768: 'Togo', 646: 'Rwanda',
        108: 'Burundi', 140: 'Central African Republic', 728: 'South Sudan',
        232: 'Eritrea', 72: 'Botswana', 516: 'Namibia',
        748: 'Eswatini', 426: 'Lesotho', 174: 'Comoros', 450: 'Madagascar',
      };

      if (!mounted || !svgRef.current || !containerRef.current) return;
      const container = containerRef.current;
      const W = container.clientWidth;
      const H = container.clientHeight;

      const R = W * 0.52;
      const cx = W * 0.68;
      const cy = H * 0.72;

      const ISS_ALT_FACTOR = 1.045;

      const svg = d3.select(svgRef.current).attr('width', W).attr('height', H);
      svg.selectAll('*').remove();
      const defs = svg.append('defs');

      const oceanGrad = defs.append('radialGradient').attr('id', 'def-ocean').attr('cx', '40%').attr('cy', '36%').attr('r', '62%');
      oceanGrad.append('stop').attr('offset', '0%').attr('stop-color', theme.ocean0);
      oceanGrad.append('stop').attr('offset', '50%').attr('stop-color', theme.ocean50);
      oceanGrad.append('stop').attr('offset', '100%').attr('stop-color', theme.ocean100);

      const specGrad = defs.append('radialGradient').attr('id', 'def-spec').attr('cx', '28%').attr('cy', '26%').attr('r', '48%');
      specGrad.append('stop').attr('offset', '0%').attr('stop-color', theme.spec0).attr('stop-opacity', 0.6);
      specGrad.append('stop').attr('offset', '100%').attr('stop-color', theme.spec100).attr('stop-opacity', 0);

      const atmGrad = defs.append('radialGradient').attr('id', 'def-atm').attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
      atmGrad.append('stop').attr('offset', '86%').attr('stop-color', 'transparent').attr('stop-opacity', 0);
      atmGrad.append('stop').attr('offset', '96%').attr('stop-color', theme.atm96).attr('stop-opacity', 0.14);
      atmGrad.append('stop').attr('offset', '100%').attr('stop-color', theme.atm100).attr('stop-opacity', 0.28);

      const rimGrad = defs.append('radialGradient').attr('id', 'def-rim').attr('cx', '50%').attr('cy', '88%').attr('r', '50%');
      rimGrad.append('stop').attr('offset', '0%').attr('stop-color', '#E31B54').attr('stop-opacity', 0.12);
      rimGrad.append('stop').attr('offset', '100%').attr('stop-color', '#E31B54').attr('stop-opacity', 0);

      const selGlow = defs.append('filter').attr('id', 'def-sel-glow').attr('x', '-30%').attr('y', '-30%').attr('width', '160%').attr('height', '160%');
      selGlow.append('feGaussianBlur').attr('stdDeviation', '1.6').attr('result', 'b');
      const fm = selGlow.append('feMerge');
      fm.append('feMergeNode').attr('in', 'b');
      fm.append('feMergeNode').attr('in', 'SourceGraphic');

      const hoverGlow = defs.append('filter').attr('id', 'def-hover-glow').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
      hoverGlow.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'b');
      const hfm = hoverGlow.append('feMerge');
      hfm.append('feMergeNode').attr('in', 'b');
      hfm.append('feMergeNode').attr('in', 'SourceGraphic');

      const scanFilter = defs.append('filter').attr('id', 'def-scan-blur').attr('x', '-8%').attr('y', '-8%').attr('width', '116%').attr('height', '116%');
      scanFilter.append('feGaussianBlur').attr('stdDeviation', '1.8');

      const beaconGlow = defs.append('filter').attr('id', 'def-beacon-glow').attr('x', '-100%').attr('y', '-100%').attr('width', '300%').attr('height', '300%');
      beaconGlow.append('feGaussianBlur').attr('stdDeviation', '1.5').attr('result', 'blur');
      const bfm = beaconGlow.append('feMerge');
      bfm.append('feMergeNode').attr('in', 'blur');
      bfm.append('feMergeNode').attr('in', 'SourceGraphic');

      const issGlow = defs.append('filter').attr('id', 'def-iss-glow').attr('x', '-150%').attr('y', '-150%').attr('width', '400%').attr('height', '400%');
      issGlow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
      const ifm = issGlow.append('feMerge');
      ifm.append('feMergeNode').attr('in', 'blur');
      ifm.append('feMergeNode').attr('in', 'SourceGraphic');

      const projection = d3.geoOrthographic().scale(R).translate([cx, cy]).clipAngle(90).rotate(rotation);
      const path = d3.geoPath().projection(projection);

      const issProjection = d3.geoOrthographic().scale(R * ISS_ALT_FACTOR).translate([cx, cy]).clipAngle(90).rotate(rotation);

      const g = svg.append('g');

      Array.from({ length: 200 }, () => ({
        x: Math.random() * W, y: Math.random() * H * 0.62,
        r: Math.random() * 0.7 + 0.1, o: Math.random() * 0.28 + 0.06,
      })).forEach(s => {
        g.append('circle').attr('class', 'star-pt').attr('data-base-o', s.o).attr('cx', s.x).attr('cy', s.y).attr('r', s.r).attr('fill', theme.starFill).attr('opacity', s.o * theme.starMaxOpacity / 0.28);
      });

      g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R * 1.045).attr('fill', 'none')
        .attr('stroke', 'rgba(160,185,210,0.07)').attr('stroke-width', R * 0.038).attr('pointer-events', 'none');
      g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R * 1.19).attr('fill', 'url(#def-atm)').attr('pointer-events', 'none');
      g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R * 1.12).attr('fill', 'url(#def-rim)').attr('pointer-events', 'none');
      g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R).attr('fill', 'url(#def-ocean)').attr('stroke', 'rgba(120,145,175,0.07)').attr('stroke-width', 0.6);
      g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R).attr('fill', 'url(#def-spec)').attr('pointer-events', 'none');

      const hS = 20; const hH = hS * Math.sqrt(3);
      const hexPat = defs.append('pattern').attr('id', 'def-hex').attr('width', hS * 3).attr('height', hH)
        .attr('patternUnits', 'userSpaceOnUse').attr('patternTransform', `translate(${cx - R},${cy - R})`);
      const hexPath = (ox: number, oy: number) => {
        const pts = Array.from({ length: 6 }, (_, i) => {
          const a = (Math.PI / 180) * (60 * i - 30);
          return `${ox + hS * Math.cos(a)},${oy + hS * Math.sin(a)}`;
        });
        return 'M' + pts.join('L') + 'Z';
      };
      [[hS, hH / 2], [hS * 2.5, hH]].forEach(([ox, oy]) => {
        hexPat.append('path').attr('d', hexPath(ox, oy)).attr('fill', 'none').attr('stroke', theme.hexStroke).attr('stroke-width', 0.5);
      });
      defs.append('clipPath').attr('id', 'def-sphere-clip').append('circle').attr('cx', cx).attr('cy', cy).attr('r', R - 1);
      g.append('rect').attr('x', cx - R).attr('y', cy - R).attr('width', R * 2).attr('height', R * 2)
        .attr('fill', 'url(#def-hex)').attr('clip-path', 'url(#def-sphere-clip)').attr('pointer-events', 'none');

      g.append('path').datum(d3.geoGraticule().step([10, 10])()).attr('d', path).attr('fill', 'none')
        .attr('stroke', theme.gratF).attr('stroke-width', 0.3).attr('class', 'grat-f');
      g.append('path').datum(d3.geoGraticule().step([30, 30])()).attr('d', path).attr('fill', 'none')
        .attr('stroke', theme.gratM).attr('stroke-width', 0.55).attr('class', 'grat-m');

      g.append('path')
        .datum({ type: 'LineString', coordinates: Array.from({ length: 361 }, (_, i) => [i - 180, 0]) })
        .attr('d', path).attr('fill', 'none').attr('stroke', theme.equatorStroke).attr('stroke-width', 0.6)
        .attr('stroke-dasharray', '4,7').attr('class', 'equator');

      [-23.5, 23.5].forEach((lat, i) => {
        g.append('path')
          .datum({ type: 'LineString', coordinates: Array.from({ length: 361 }, (_, j) => [j - 180, lat]) })
          .attr('d', path).attr('fill', 'none').attr('stroke', theme.tropicStroke)
          .attr('stroke-width', 0.35).attr('stroke-dasharray', '2,9').attr('class', `tropic-${i}`);
      });

      const scanRing = g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R * 0.25).attr('fill', 'none')
        .attr('stroke', theme.scanStroke).attr('stroke-width', 0.7)
        .attr('filter', 'url(#def-scan-blur)').attr('pointer-events', 'none').attr('class', 'scan-ring');

      const getFill = (name: string, hovered: boolean, selected: boolean, t: GlobeTheme = themeRef.current) => {
        if (selected) return t.landSelectedFill;
        if (hovered) return t.landHoverFill;
        return COUNTRY_DATA[name] ? t.landKnown : t.landUnknown;
      };
      const getStroke = (name: string, hovered: boolean, selected: boolean, t: GlobeTheme = themeRef.current) => {
        if (selected) return 'rgba(227,27,84,0.85)';
        if (hovered) return t.landHoverStroke;
        return COUNTRY_DATA[name] ? t.landKnownStroke : t.landUnknownStroke;
      };

      const setCountryHover = (name: string, hovered: boolean) => {
        if (!name) return;
        const t = themeRef.current;
        const isSel = stateRef.current.selected === name;
        if (isSel) return;
        countriesLayer.selectAll('.country')
          .filter((dd: any) => (ID_TO_NAME[+dd.id] || '') === name)
          .attr('fill', getFill(name, hovered, false, t))
          .attr('stroke', getStroke(name, hovered, false, t))
          .attr('stroke-width', hovered ? 2.2 : 0.5)
          .attr('filter', hovered ? 'url(#def-hover-glow)' : null);
        stateRef.current.hoveredCountry = hovered ? name : null;
      };

      const countriesLayer = g.append('g').attr('class', 'countries-layer');
      countriesLayer.selectAll('.country').data(countriesGeo.features).join('path').attr('class', 'country')
        .attr('d', path as any)
        .attr('data-has-data', (d: any) => COUNTRY_DATA[ID_TO_NAME[+d.id] || ''] ? 'true' : 'false')
        .attr('fill', (d: any) => getFill(ID_TO_NAME[+d.id] || '', false, false))
        .attr('stroke', (d: any) => getStroke(ID_TO_NAME[+d.id] || '', false, false))
        .attr('stroke-width', 0.5).attr('cursor', 'pointer')
        .each(function(d: any) { (this as any).__countryName = ID_TO_NAME[+d.id] || ''; })
        .on('mouseenter', function(e: any, d: any) {
          const name = ID_TO_NAME[+d.id] || '';
          if (stateRef.current.selected === name) return;
          setCountryHover(name, true);
        })
        .on('mouseleave', function(e: any, d: any) {
          const name = ID_TO_NAME[+d.id] || '';
          if (stateRef.current.selected === name) return;
          setCountryHover(name, false);
        })
        .on('click', function(e: any, d: any) {
          const name = ID_TO_NAME[+d.id] || '';
          const prev = stateRef.current.selected;

          if (prev) {
            const t = themeRef.current;
            countriesLayer.selectAll('.country')
              .filter((dd: any) => (ID_TO_NAME[+dd.id] || '') === prev)
              .attr('fill', getFill(prev, false, false, t))
              .attr('stroke', getStroke(prev, false, false, t))
              .attr('stroke-width', 0.5)
              .attr('filter', null);
          }

          if (!name || prev === name) {
            stateRef.current.selected = null;
            onCountrySelect(null);
          } else {
            stateRef.current.selected = name;
            const info = COUNTRY_DATA[name] ?? {
              name, iso: '???', region: 'UNKNOWN', threat: 'LOW' as const, partners: 0, contracts: 0,
            };
            onCountrySelect(info);
            d3.select(this)
              .attr('fill', getFill(name, false, true))
              .attr('stroke', 'rgba(227,27,84,0.85)')
              .attr('stroke-width', 2.0)
              .attr('filter', 'url(#def-sel-glow)');
          }
        });

      g.append('path').datum(bordersGeo).attr('d', path).attr('fill', 'none')
        .attr('stroke', theme.borderStroke).attr('stroke-width', 0.45)
        .attr('pointer-events', 'none').attr('class', 'borders');

      g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R + 8).attr('fill', 'none').attr('stroke', theme.ring1).attr('data-ring', '1').attr('stroke-width', 0.5).attr('stroke-dasharray', '3,8').attr('pointer-events', 'none');
      g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R + 20).attr('fill', 'none').attr('stroke', theme.ring2).attr('data-ring', '2').attr('stroke-width', 0.4).attr('stroke-dasharray', '6,10').attr('pointer-events', 'none');
      g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R + 34).attr('fill', 'none').attr('stroke', theme.ring3).attr('data-ring', '3').attr('stroke-width', 0.5).attr('stroke-dasharray', '2,6').attr('pointer-events', 'none');

      const tR = R + 42;
      for (let a = 0; a < 360; a += 10) {
        const rad = (a * Math.PI) / 180;
        const isCardinal = a % 90 === 0; const isMajor = a % 30 === 0;
        const len = isCardinal ? 10 : isMajor ? 5 : 2.5;
        const tickKind = isCardinal ? 'cardinal' : isMajor ? 'major' : 'minor';
        const strokeC = isCardinal ? theme.tickCardinal : isMajor ? theme.tickMajor : theme.tickMinor;
        g.append('line')
          .attr('x1', cx + (tR - len) * Math.cos(rad)).attr('y1', cy + (tR - len) * Math.sin(rad))
          .attr('x2', cx + tR * Math.cos(rad)).attr('y2', cy + tR * Math.sin(rad))
          .attr('stroke', strokeC).attr('data-tick', tickKind).attr('stroke-width', isCardinal ? 1.1 : 0.5);
      }

      const rhLen = 18;
      g.append('line').attr('x1', cx - rhLen).attr('y1', cy - R).attr('x2', cx + rhLen).attr('y2', cy - R).attr('stroke', theme.poleStroke).attr('data-pole-line', '1').attr('stroke-width', 0.6);
      g.append('line').attr('x1', cx).attr('y1', cy - R - rhLen).attr('x2', cx).attr('y2', cy - R + rhLen).attr('stroke', theme.poleStroke).attr('data-pole-line', '2').attr('stroke-width', 0.6);
      g.append('circle').attr('cx', cx).attr('cy', cy - R).attr('r', 2.5).attr('fill', 'none').attr('stroke', theme.poleDot).attr('data-pole-dot', '1').attr('stroke-width', 0.6);

      const beaconsLayer = g.append('g').attr('class', 'beacons-layer');
      const beaconSelections: ReturnType<typeof beaconsLayer.append>[] = [];

      CAPITALS.forEach((cap, idx) => {
        const bg = beaconsLayer.append('g')
          .attr('cursor', 'pointer')
          .attr('pointer-events', 'all');
        beaconSelections[idx] = bg;

        bg.append('circle').attr('r', 10).attr('fill', 'transparent');
        bg.append('circle').attr('class', 'beacon-pulse').attr('r', 5).attr('fill', 'none')
          .attr('stroke', theme.beaconPulse).attr('stroke-width', 0.7);
        bg.append('circle').attr('r', 1.5).attr('fill', theme.beaconDot).attr('data-beacon-dot', '1').attr('filter', 'url(#def-beacon-glow)');

        bg.on('mouseenter', function(event: any) {
          const [mx, my] = d3.pointer(event, svgRef.current);
          if (mounted) setTooltip({ capital: cap, x: mx, y: my });
          if (cap.countryMapName) setCountryHover(cap.countryMapName, true);
        }).on('mousemove', function(event: any) {
          const [mx, my] = d3.pointer(event, svgRef.current);
          if (mounted) setTooltip({ capital: cap, x: mx, y: my });
        }).on('mouseleave', function() {
          if (mounted) setTooltip(null);
          if (cap.countryMapName) setCountryHover(cap.countryMapName, false);
        });
      });

      const ISS_PERIOD_MS = 180000;

      g.append('circle')
        .attr('cx', cx).attr('cy', cy)
        .attr('r', R * ISS_ALT_FACTOR)
        .attr('fill', 'none')
        .attr('stroke', theme.issTrack)
        .attr('stroke-width', 0.7)
        .attr('stroke-dasharray', '3,6')
        .attr('pointer-events', 'none')
        .attr('class', 'iss-track-ring');

      const issGroup = g.append('g').attr('class', 'iss-group').attr('pointer-events', 'visiblePainted').attr('cursor', 'pointer');
      issGroup.append('line').attr('stroke', theme.issColor).attr('stroke-width', 1.4)
        .attr('x1', -10).attr('x2', 10).attr('y1', 0).attr('y2', 0);
      issGroup.append('line').attr('stroke', theme.issColor).attr('stroke-width', 0.9)
        .attr('x1', 0).attr('x2', 0).attr('y1', -5).attr('y2', 5);
      issGroup.append('circle').attr('r', 2.5).attr('fill', theme.issColor).attr('filter', 'url(#def-iss-glow)');
      issGroup.append('circle').attr('r', 5.5).attr('fill', 'none')
        .attr('stroke', theme.issColor).attr('stroke-width', 0.6).attr('stroke-opacity', 0.6);
      issGroup.append('text').attr('x', 9).attr('y', -7)
        .attr('font-family', 'ui-monospace,Menlo,monospace').attr('font-size', '7px')
        .attr('fill', theme.issColor).attr('letter-spacing', '0.08em').text('ISS');

      issGroup.on('mouseenter', function(event: any) {
        const [mx, my] = d3.pointer(event, svgRef.current);
        if (mounted) setIssTooltip({ x: mx, y: my });
      }).on('mousemove', function(event: any) {
        const [mx, my] = d3.pointer(event, svgRef.current);
        if (mounted) setIssTooltip({ x: mx, y: my });
      }).on('mouseleave', function() {
        if (mounted) setIssTooltip(null);
      });

      let cachedLonR = 0, cachedLatR = 0;
      let cachedCosLat = 1, cachedSinLat = 0;

      const refreshRotationCache = () => {
        const rot = projection.rotate();
        cachedLonR = -rot[0] * (Math.PI / 180);
        cachedLatR = -rot[1] * (Math.PI / 180);
        cachedCosLat = Math.cos(cachedLatR);
        cachedSinLat = Math.sin(cachedLatR);
        issProjection.rotate(rot);
      };

      const isVisible = (lonDeg: number, latDeg: number) => {
        const lonP = lonDeg * (Math.PI / 180);
        const latP = latDeg * (Math.PI / 180);
        return Math.cos(latP) * cachedCosLat * Math.cos(lonP - cachedLonR) + Math.sin(latP) * cachedSinLat;
      };

      const redraw = () => {
        refreshRotationCache();

        g.select('.grat-f').attr('d', path as any);
        g.select('.grat-m').attr('d', path as any);
        g.select('.equator').attr('d', path as any);
        g.select('.tropic-0').attr('d', path as any);
        g.select('.tropic-1').attr('d', path as any);
        g.selectAll('.country').attr('d', path as any);
        g.select('.borders').attr('d', path as any);

        for (let i = 0; i < CAPITALS.length; i++) {
          const cap = CAPITALS[i];
          const dot = isVisible(cap.lon, cap.lat);
          if (dot > 0.08) {
            const proj = projection([cap.lon, cap.lat]);
            if (proj) {
              const t = themeRef.current;
              beaconSelections[i].attr('display', 'block').attr('transform', `translate(${proj[0]},${proj[1]})`).selectAll('circle').filter((_: any, j: number) => j === 2).attr('fill', t.beaconDot);
              continue;
            }
          }
          beaconSelections[i].attr('display', 'none');
        }

        const issT = stateRef.current.issT;
        const issLon = issT * 360 - 180;
        const issLat = 51.6 * Math.sin(issT * 2 * Math.PI);
        const issDot = isVisible(issLon, issLat);
        const issProj = issDot > 0.02 ? issProjection([issLon, issLat]) : null;
        if (issProj) {
          issGroup.attr('display', 'block').attr('transform', `translate(${issProj[0]},${issProj[1]})`);
        } else {
          issGroup.attr('display', 'none');
        }
      };

      svg.call(d3.drag()
        .on('start', (e: any) => { isDragging = true; lastX = e.x; lastY = e.y; setTooltip(null); setIssTooltip(null); })
        .on('drag', (e: any) => {
          rotation[0] += (e.x - lastX) * 0.32;
          rotation[1] = Math.max(-75, Math.min(75, rotation[1] - (e.y - lastY) * 0.32));
          lastX = e.x; lastY = e.y; projection.rotate(rotation); redraw();
        })
        .on('end', () => { isDragging = false; }) as any);

      stateRef.current = { issT: 0, selected: null, hoveredCountry: null };
      let lastTime = performance.now();
      let scanT = 0;

      const animate = () => {
        if (!mounted) return;
        animFrame = requestAnimationFrame(animate);
        const now = performance.now();
        const dt = now - lastTime; lastTime = now;

        scanT = (scanT + 0.004) % 1;
        scanRing.attr('r', R * (0.15 + scanT * 0.85)).attr('stroke-opacity', (1 - scanT) * 0.45);

        stateRef.current.issT = (stateRef.current.issT + dt / ISS_PERIOD_MS) % 1;

        const phase = now / 800;
        const pulseR = 3 + 4 * ((Math.sin(phase) + 1) / 2);
        const pulseO = 0.3 + 0.4 * ((Math.cos(phase) + 1) / 2);
        beaconsLayer.selectAll('.beacon-pulse').attr('r', pulseR).attr('stroke-opacity', pulseO).attr('stroke', themeRef.current.beaconPulse);

        if (!isDragging) { rotation[0] += 0.07; projection.rotate(rotation); }
        redraw();
      };
      animate();

      const t = themeRef.current;
      svgRef.current?.querySelectorAll('.country').forEach(el => {
        const p = el as SVGPathElement;
        if (p.getAttribute('filter')) return;
        const hasData = p.dataset.hasData === 'true';
        p.style.fill = hasData ? t.landKnown : t.landUnknown;
        p.style.stroke = hasData ? t.landKnownStroke : t.landUnknownStroke;
      });
      const borders = svgRef.current?.querySelector('.borders') as SVGPathElement | null;
      if (borders) borders.style.stroke = t.borderStroke;

      setIsLoading(false);
    };

    loadAndInit();
    return () => { mounted = false; cancelAnimationFrame(animFrame); };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {isLoading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
          <div style={{ width: 32, height: 32, border: '1.5px solid rgba(227,27,84,0.2)', borderTop: '1.5px solid #E31B54', borderRadius: '50%', animation: 'dvSpin 1s linear infinite' }} />
          <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.55rem', color: 'rgba(227,27,84,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>LOADING GEO DATA...</span>
        </div>
      )}
      <svg ref={svgRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      {/* Capital city tooltip */}
      {tooltip && (() => {
        const svgW = svgRef.current?.clientWidth ?? 600;
        const svgH = svgRef.current?.clientHeight ?? 600;
        const TW = 215; const TH = 115; const margin = 12;
        let tx = tooltip.x + 16;
        let ty = tooltip.y - 16;
        if (tx + TW > svgW - margin) tx = tooltip.x - TW - 16;
        if (ty + TH > svgH - margin) ty = tooltip.y - TH - 4;
        if (ty < margin) ty = margin;
        const cap = tooltip.capital;
        return (
          <div style={{ position: 'absolute', left: tx, top: ty, width: TW, pointerEvents: 'none', zIndex: 30, animation: 'dvFade 0.12s ease' }}>
            {(() => {
              const b = `1px solid ${themeRef.current.tooltipAccent}`;
              return [
                { top: 0, left: 0, borderTop: b, borderLeft: b },
                { top: 0, right: 0, borderTop: b, borderRight: b },
                { bottom: 0, left: 0, borderBottom: b, borderLeft: b },
                { bottom: 0, right: 0, borderBottom: b, borderRight: b },
              ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 8, height: 8, ...s }} />);
            })()}
            <div style={{ margin: '4px', background: themeRef.current.tooltipBg, border: `1px solid ${themeRef.current.tooltipBorder}`, borderRadius: 2, backdropFilter: 'blur(16px)', overflow: 'hidden' }}>
              <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${themeRef.current.tooltipAccent}, transparent)` }} />
              <div style={{ padding: '8px 10px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                  <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.44rem', fontWeight: 700, letterSpacing: '0.2em', color: themeRef.current.tooltipAccent, border: `1px solid ${themeRef.current.tooltipBorder}`, padding: '1px 5px', borderRadius: 2 }}>{cap.iso}</span>
                  <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.42rem', color: themeRef.current.tooltipMeta, letterSpacing: '0.14em', textTransform: 'uppercase' }}>CAPITAL SIG</span>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: themeRef.current.beaconDot, boxShadow: `0 0 5px ${themeRef.current.beaconDot}`, animation: 'dvPulse 1.8s ease infinite' }} />
                    <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.4rem', color: themeRef.current.tooltipMeta, letterSpacing: '0.1em' }}>LIVE</span>
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: themeRef.current.tooltipText, letterSpacing: '0.01em', lineHeight: 1.1, marginBottom: 1 }}>{cap.country}</div>
                <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.48rem', color: themeRef.current.tooltipAccent, letterSpacing: '0.12em', marginBottom: 8 }}>{cap.name.toUpperCase()}</div>
                <div style={{ height: 1, background: themeRef.current.tooltipBorder, marginBottom: 8 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 8px' }}>
                  <div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.38rem', color: themeRef.current.tooltipMeta, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 2 }}>{cap.title}</div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 600, color: themeRef.current.tooltipSubtext, lineHeight: 1.25 }}>{cap.leader}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.38rem', color: themeRef.current.tooltipMeta, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 2 }}>Gov. Type</div>
                    <div style={{ fontSize: '0.53rem', fontWeight: 500, color: themeRef.current.tooltipMeta, lineHeight: 1.25 }}>{cap.gov}</div>
                  </div>
                </div>
              </div>
              <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${themeRef.current.tooltipBorder}, transparent)` }} />
            </div>
          </div>
        );
      })()}

      {/* ISS Tooltip */}
      {issTooltip && (() => {
        const svgW = svgRef.current?.clientWidth ?? 600;
        const svgH = svgRef.current?.clientHeight ?? 600;
        const TW = 248; const TH = 200; const margin = 12;
        let tx = issTooltip.x + 16;
        let ty = issTooltip.y - 16;
        if (tx + TW > svgW - margin) tx = issTooltip.x - TW - 16;
        if (ty + TH > svgH - margin) ty = issTooltip.y - TH - 4;
        if (ty < margin) ty = margin;
        const t = themeRef.current;
        return (
          <div style={{ position: 'absolute', left: tx, top: ty, width: TW, pointerEvents: 'none', zIndex: 30, animation: 'dvFade 0.12s ease' }}>
            {(() => {
              const b = `1px solid ${t.issColor}`;
              return [
                { top: 0, left: 0, borderTop: b, borderLeft: b },
                { top: 0, right: 0, borderTop: b, borderRight: b },
                { bottom: 0, left: 0, borderBottom: b, borderLeft: b },
                { bottom: 0, right: 0, borderBottom: b, borderRight: b },
              ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 8, height: 8, ...s }} />);
            })()}
            <div style={{ margin: '4px', background: t.tooltipBg, border: `1px solid rgba(0,220,255,0.12)`, borderRadius: 2, backdropFilter: 'blur(16px)', overflow: 'hidden' }}>
              <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${t.issColor}, transparent)` }} />
              <div style={{ padding: '8px 10px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                  <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.44rem', fontWeight: 700, letterSpacing: '0.2em', color: t.issColor, border: `1px solid rgba(0,220,255,0.22)`, padding: '1px 5px', borderRadius: 2 }}>ISS</span>
                  <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.42rem', color: t.tooltipMeta, letterSpacing: '0.14em', textTransform: 'uppercase' }}>ORBIT SIG</span>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: t.issColor, boxShadow: `0 0 5px ${t.issColor}`, animation: 'dvPulse 1.8s ease infinite' }} />
                    <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.4rem', color: t.tooltipMeta, letterSpacing: '0.1em' }}>LIVE</span>
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: t.tooltipText, letterSpacing: '0.01em', lineHeight: 1.1, marginBottom: 2 }}>{ISS_INFO.fullName}</div>
                <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.44rem', color: t.issColor, letterSpacing: '0.1em', marginBottom: 8 }}>SINCE {ISS_INFO.launched} · CREW CAP. {ISS_INFO.crewCapacity}</div>
                <div style={{ height: 1, background: `rgba(0,220,255,0.1)`, marginBottom: 8 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 8px', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.36rem', color: t.tooltipMeta, letterSpacing: '0.12em', marginBottom: 2 }}>ALTITUDE</div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.62rem', fontWeight: 700, color: t.issColor }}>{ISS_INFO.altitude}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.36rem', color: t.tooltipMeta, letterSpacing: '0.12em', marginBottom: 2 }}>VELOCITY</div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.62rem', fontWeight: 700, color: t.issColor }}>{ISS_INFO.speed}</div>
                  </div>
                </div>
                <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.36rem', color: t.tooltipMeta, letterSpacing: '0.12em', marginBottom: 4 }}>PARTNER NATIONS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {ISS_INFO.countries.map(c => (
                    <span key={c} style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.38rem', color: t.tooltipSubtext, background: `rgba(0,220,255,0.06)`, border: `1px solid rgba(0,220,255,0.12)`, padding: '1px 4px', borderRadius: 2 }}>{c}</span>
                  ))}
                </div>
              </div>
              <div style={{ height: 1, background: `linear-gradient(90deg, transparent, rgba(0,220,255,0.12), transparent)` }} />
            </div>
          </div>
        );
      })()}
    </div>
  );
};

// ── Country intel overlay ──────────────────────────────────────────────────
const CountryCard = ({ info, onClose, isLight }: { info: CountryInfo; onClose: () => void; isLight: boolean }) => {
  const tc = THREAT_COLORS[info.threat];
  const modalBg = isLight ? 'rgba(250,248,244,0.97)' : 'rgba(5,7,11,0.97)';
  const textColor = isLight ? 'rgba(15,25,45,0.92)' : '#fff';
  const metaColor = isLight ? 'rgba(15,25,45,0.35)' : 'rgba(255,255,255,0.3)';
  const statBg = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)';
  const statBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.07)';
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0, zIndex: 18,
          background: 'rgba(0,0,0,0.62)',
          backdropFilter: 'blur(3px)',
          animation: 'dvFade 0.2s ease',
        }}
      />
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
        width: 'clamp(260px, 72%, 360px)',
        border: `1px solid ${tc}40`,
        borderRadius: 8,
        background: modalBg,
        backdropFilter: 'blur(24px)',
        padding: '18px 20px 20px',
        animation: 'dvCardIn 0.22s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: `0 0 60px ${tc}18, 0 24px 80px rgba(0,0,0,0.6)`,
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: '8px 8px 0 0', background: `linear-gradient(90deg, transparent, ${tc}80, ${tc}40, transparent)` }} />
        {[
          { top: 6, left: 6, borderTop: `1px solid ${tc}55`, borderLeft: `1px solid ${tc}55` },
          { top: 6, right: 6, borderTop: `1px solid ${tc}55`, borderRight: `1px solid ${tc}55` },
          { bottom: 6, left: 6, borderBottom: `1px solid ${tc}55`, borderLeft: `1px solid ${tc}55` },
          { bottom: 6, right: 6, borderBottom: `1px solid ${tc}55`, borderRight: `1px solid ${tc}55` },
        ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 10, height: 10, ...s }} />)}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.5rem', color: metaColor, letterSpacing: '0.15em', marginBottom: 3 }}>[{info.iso}] // {info.region}</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: textColor, letterSpacing: '0.02em', lineHeight: 1.1 }}>{info.name}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.14em', color: tc, border: `1px solid ${tc}44`, padding: '2px 7px', borderRadius: 3 }}>{info.threat} THREAT</span>
            <button onClick={onClose} style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.48rem', color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em', padding: 0 }}>[DESELECT]</button>
          </div>
        </div>

        <div style={{ height: 1, background: `linear-gradient(90deg, ${tc}22, transparent)`, marginBottom: 14 }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[{ label: 'Partners', value: info.partners }, { label: 'Contracts', value: info.contracts }].map(s => (
            <div key={s.label} style={{ background: statBg, border: `1px solid ${statBorder}`, padding: '10px 12px', borderRadius: 5 }}>
              <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '1.4rem', fontWeight: 700, color: tc, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.5rem', color: metaColor, letterSpacing: '0.08em', marginTop: 3, textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ position: 'absolute', inset: 0, borderRadius: 8, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)' }} />
      </div>
    </>
  );
};

// ── Isolated blink ────────────────────────────────────────────────────────
const SigBlink = () => {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn(v => !v), 1400);
    return () => clearInterval(id);
  }, []);
  return <>{on ? 'SIG ●●●●○' : 'SIG ●●●○○'}</>;
};

// ── Main ───────────────────────────────────────────────────────────────────
const VenturesTab = () => {
  const [activeProduct, setActiveProduct] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);

  const isLight = useSiteThemeIsLight();
  const globeTheme = isLight ? LIGHT_THEME : DARK_THEME;

  const handleProductChange = (idx: number) => {
    if (idx === activeProduct) return;
    setIsTransitioning(true);
    setTimeout(() => { setActiveProduct(idx); setIsTransitioning(false); }, 180);
  };

  const handleCountryClose = () => {
    setSelectedCountry(null);
    window.dispatchEvent(new CustomEvent('globe-deselect-country'));
  };

  const product = PRODUCTS[activeProduct];

  return (
    <>
      <style>{`
        @keyframes dvOrbit {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes dvPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(227,27,84,0.5); }
          50%       { opacity: .7; box-shadow: 0 0 0 4px rgba(227,27,84,0); }
        }
        @keyframes dvSpin { to { transform: rotate(360deg); } }
        @keyframes dvFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes dvCardIn {
          from { opacity: 0; transform: translate(-50%, -46%) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .dv-lm-border::before {
          content: ''; position: absolute; inset: 0; z-index: 0; border-radius: 10.5px;
          background: linear-gradient(90deg, rgba(0,255,166,0) 0%, rgba(0,255,166,0.9) 15%, rgba(255,215,0,0.7) 30%, rgba(236,72,153,0.7) 45%, rgba(147,51,234,0.7) 60%, rgba(59,130,246,0.6) 75%, rgba(0,255,166,0) 90%);
          background-size: 200% 100%; animation: dvOrbit 3s linear infinite;
          opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
        }
        .dv-lm-border:hover::before { opacity: 1; }
        .dv-lm-border:hover .dv-lm-btn { color: var(--content-primary, rgba(255,255,255,0.92)) !important; }

        /* ── Carousel — dark default ── */
        .dv-carousel-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); width: 100%;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .dv-carousel-cell {
          position: relative; padding: 28px 22px 30px; min-height: 140px;
          cursor: pointer; border: none; background: transparent; text-align: left;
          transition: background 0.22s ease;
          border-right: 1px solid rgba(255,255,255,0.07);
        }
        .dv-carousel-cell:last-child { border-right: none; }
        .dv-carousel-cell.active { background: rgba(227,27,84,0.06); }
        .dv-carousel-cell.active::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(227,27,84,0.7), transparent);
        }
        .dv-carousel-cell:not(.active):hover { background: rgba(255,255,255,0.025); }

        /* ── Carousel — light mode overrides ── */
        :root.light .dv-carousel-grid {
          border-top-color: rgba(0,0,0,0.09);
        }
        :root.light .dv-carousel-cell {
          border-right-color: rgba(0,0,0,0.09);
        }
        :root.light .dv-carousel-cell.active { background: rgba(227,27,84,0.05); }
        :root.light .dv-carousel-cell:not(.active):hover { background: rgba(0,0,0,0.035); }
        :root.light .dv-carousel-cell-tag-inactive { color: rgba(0,0,0,0.28) !important; }
        :root.light .dv-carousel-cell-title-inactive { color: rgba(0,0,0,0.32) !important; }
        :root.light .dv-carousel-cell-title-active { color: rgba(0,0,0,0.88) !important; }
        :root.light .dv-carousel-cell-stat-inactive { color: rgba(0,0,0,0.18) !important; }
        :root.light .dv-carousel-cell-statlabel { color: rgba(0,0,0,0.28) !important; }
        :root.light .dv-sector-label { color: rgba(0,0,0,0.28) !important; }
        :root.light .dv-sector-counter { color: rgba(0,0,0,0.22) !important; }
        :root.light .dv-sector-divider { background: linear-gradient(90deg, rgba(0,0,0,0.07), transparent) !important; }
        :root.light .dv-header-divider { background: rgba(0,0,0,0.1) !important; }
        :root.light .dv-defense-label { color: rgba(0,0,0,0.3) !important; }

        /* ── "Visit Website" secondary button — light mode ── */
        :root.light .dv-btn-secondary {
          background: rgba(255,255,255,0.9) !important;
          color: rgba(0,0,0,0.7) !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,1), 0 0 0 1px rgba(0,0,0,0.09) !important;
        }
        :root.light .dv-btn-secondary:hover { color: rgba(0,0,0,0.9) !important; }

        @media (max-width: 860px) {
          .dv-main-grid { grid-template-columns: 1fr !important; }
          .dv-globe-col { min-height: 50vh !important; order: 2; }
          .dv-hero-col  { order: 1; }
          .dv-carousel-grid { grid-template-columns: 1fr !important; }
          .dv-carousel-cell { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.07); }
          :root.light .dv-carousel-cell { border-bottom-color: rgba(0,0,0,0.09) !important; }
          .dv-carousel-cell:last-child { border-bottom: none; }
        }
      `}</style>

      <section style={{ minHeight: 'auto', marginTop: 0, background: 'transparent', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.018, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '100px 100px' }} />

        <div className="dv-main-grid" style={{ display: 'grid', gridTemplateColumns: '50% 50%', borderTop: '1px dashed var(--border-dashed)', borderBottom: '1px dashed var(--border-dashed)', background: 'var(--gradient-section)', minHeight: '100vh' }}>

          {/* ══ LEFT ══ */}
          <div className="dv-hero-col" style={{ display: 'flex', flexDirection: 'column', borderRight: '1px dashed var(--border-dashed)', position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
            <div style={{ position: 'absolute', top: '20%', left: '-10%', width: '70%', height: '50%', background: 'radial-gradient(ellipse at 30% 40%, rgba(227,27,84,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(2rem, 5vw, 4rem) clamp(2rem, 4vw, 3.5rem)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E31B54', animation: 'dvPulse 2s ease infinite' }} />
                  <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.58rem', letterSpacing: '0.22em', fontWeight: 700, color: '#E31B54', textTransform: 'uppercase' }}>Notus Regalia</span>
                </div>
                <span style={{ width: 1, height: 10, background: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
                <span className="dv-defense-label" style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.55rem', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Defense Division</span>
              </div>

              <div style={{ marginBottom: '2rem', opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? 'translateY(8px)' : 'translateY(0)', transition: 'opacity 0.18s ease, transform 0.18s ease' }}>
                <div style={{ marginBottom: '0.9rem' }}>
                  <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(227,27,84,0.65)' }}>{product.eyebrow}</span>
                </div>
                <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.08, background: 'var(--text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '1.25rem', maxWidth: '100%' }}>{product.title}</h1>
                <div style={{ width: 40, height: 2, background: '#E31B54', borderRadius: 999, boxShadow: '0 0 8px rgba(227,27,84,0.45)', marginBottom: '1.25rem' }} />
                <p style={{ fontSize: 'clamp(0.88rem, 1.2vw, 1rem)', lineHeight: 1.75, color: 'var(--content-muted)', maxWidth: '100%', margin: 0 }}>{product.subtitle}</p>
              </div>

              <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '2.5rem', opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.18s ease' }}>
                {product.stats.map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '1.75rem', fontWeight: 700, color: '#E31B54', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.52rem', color: 'var(--content-faint)', letterSpacing: '0.1em', marginTop: 4, textTransform: 'uppercase' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {[{ label: 'Request Briefing', icon: 'bi-arrow-right', primary: true }, { label: 'Visit Website', icon: 'bi-arrow-up-right', primary: false }].map(btn => (
                  <div key={btn.label} className="dv-lm-border" style={{ display: 'inline-flex', flexShrink: 0, borderRadius: '10.5px', padding: '1px', position: 'relative', background: 'transparent', isolation: 'isolate' }}>
                    <button className={`dv-lm-btn${!btn.primary ? ' dv-btn-secondary' : ''}`} style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none', borderRadius: '9.5px', padding: btn.primary ? '0.75rem 1.5rem' : '0.75rem 1.25rem', fontSize: '0.85rem', fontWeight: btn.primary ? 600 : 500, letterSpacing: '0.01em', lineHeight: 1, cursor: 'pointer', whiteSpace: 'nowrap', background: btn.primary ? '#E31B54' : 'var(--navbar-bg, #0f0f0f)', color: btn.primary ? '#fff' : 'var(--content-faint)', boxShadow: btn.primary ? '0 4px 16px rgba(227,27,84,0.3)' : '0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 var(--glass-inset-top)', transition: 'all 0.15s ease' }}>
                      {btn.label}<i className={`bi ${btn.icon}`} style={{ fontSize: '0.8rem' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel */}
            <div style={{ width: '100%', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '10px clamp(2rem, 4vw, 3.5rem) 0' }}>
                <span className="dv-sector-label" style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.55rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>Investment Sectors</span>
                <div className="dv-sector-divider" style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.07), transparent)' }} />
                <span className="dv-sector-counter" style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.5rem', color: 'rgba(255,255,255,0.12)', letterSpacing: '0.1em' }}>{activeProduct + 1} / {PRODUCTS.length}</span>
              </div>
              <div className="dv-carousel-grid">
                {PRODUCTS.map((p, i) => (
                  <button key={p.id} className={`dv-carousel-cell${i === activeProduct ? ' active' : ''}`} onClick={() => handleProductChange(i)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <span className={i !== activeProduct ? 'dv-carousel-cell-tag-inactive' : ''} style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.16em', color: i === activeProduct ? '#E31B54' : 'rgba(255,255,255,0.25)', textTransform: 'uppercase', transition: 'color 0.22s' }}>{p.tag}</span>
                      {i === activeProduct && <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E31B54', animation: 'dvPulse 2s ease infinite', flexShrink: 0 }} />}
                    </div>
                    <div className={i === activeProduct ? 'dv-carousel-cell-title-active' : 'dv-carousel-cell-title-inactive'} style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.3, color: i === activeProduct ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.35)', marginBottom: 10, transition: 'color 0.22s' }}>{p.title}</div>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      {p.stats.slice(0, 2).map(s => (
                        <div key={s.label}>
                          <div className={i !== activeProduct ? 'dv-carousel-cell-stat-inactive' : ''} style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.9rem', fontWeight: 700, color: i === activeProduct ? '#E31B54' : 'rgba(255,255,255,0.18)', lineHeight: 1, transition: 'color 0.22s' }}>{s.value}</div>
                          <div className="dv-carousel-cell-statlabel" style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.44rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', marginTop: 2, textTransform: 'uppercase' }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ══ RIGHT: Globe ══ */}
          <div className="dv-globe-col" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', background: globeTheme.panelBg, transition: 'background 0.4s ease' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to bottom, transparent, rgba(180,195,220,0.03), transparent)', animation: 'dvScan 9s linear infinite', pointerEvents: 'none', zIndex: 10 }} />

            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(${globeTheme.bgGrid} 1px, transparent 1px), linear-gradient(90deg, ${globeTheme.bgGrid} 1px, transparent 1px)`, backgroundSize: '38px 38px' }} />
            {[
              { text: '38°54′N 077°02′W', pos: { top: '4%', left: '5%' } },
              { text: null,               pos: { top: '4%', right: '5%' } },
              { text: 'DRAG · ROTATE',   pos: { bottom: '4%', right: '5%' } },
            ].map((h, i) => (
              <span key={i} style={{ position: 'absolute', ...h.pos, fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.5rem', letterSpacing: '0.1em', color: globeTheme.hudText, pointerEvents: 'none', zIndex: 5, textTransform: 'uppercase' }}>
                {h.text ?? <SigBlink />}
              </span>
            ))}
            {[
              { top: '3%', left: '4%', borderTop: `1px solid ${globeTheme.hudBracket}`, borderLeft: `1px solid ${globeTheme.hudBracket}` },
              { top: '3%', right: '4%', borderTop: `1px solid ${globeTheme.hudBracket}`, borderRight: `1px solid ${globeTheme.hudBracket}` },
            ].map((b, i) => (
              <div key={i} style={{ position: 'absolute', width: 16, height: 16, pointerEvents: 'none', zIndex: 5, ...b }} />
            ))}

            <GlobeD3 onCountrySelect={setSelectedCountry} theme={globeTheme} />

            {selectedCountry && (
              <CountryCard info={selectedCountry} onClose={handleCountryClose} isLight={isLight} />
            )}

            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%', background: `linear-gradient(to bottom, transparent, ${globeTheme.panelBg} 80%)`, pointerEvents: 'none', zIndex: 4 }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8%', background: `linear-gradient(to bottom, ${globeTheme.panelBg}, transparent)`, pointerEvents: 'none', zIndex: 4 }} />
          </div>
        </div>
      </section>
    </>
  );
};

export default VenturesTab;