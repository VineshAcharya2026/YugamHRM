import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '../../lib/react-pdf';

// Register fonts if needed
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2', fontWeight: 700 },
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#1a1a1a',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  title: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  contact: {
    flexDirection: 'row',
    marginTop: 8,
    fontSize: 8,
    gap: 15,
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingBottom: 3,
    marginBottom: 8,
  },
  item: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  itemSub: {
    fontSize: 9,
    color: '#444',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 8,
    color: '#888',
    marginBottom: 4,
  },
  list: {
    marginLeft: 10,
  },
  listItem: {
    marginBottom: 2,
  }
});

export const ResumeTemplate: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return null;
  const { personal = {}, experience = [], education = [], skills = [], summary = '' } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personal?.fullName || 'Candidate Name'}</Text>
          <Text style={styles.title}>{personal?.tagline || 'Professional Title'}</Text>
          <View style={styles.contact}>
            <Text>{personal?.email}</Text>
            <Text>{personal?.phone}</Text>
            <Text>{personal?.location}</Text>
            <Text>{personal?.linkedin}</Text>
          </View>
        </View>

        {/* Summary */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Summary</Text>
            <Text>{summary}</Text>
          </View>
        )}

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {experience?.map((exp: any, i: number) => (
            <View key={i} style={styles.item}>
              <Text style={styles.itemTitle}>{exp.position}</Text>
              <Text style={styles.itemSub}>{exp.company}</Text>
              <Text style={styles.itemDate}>{exp.startDate} - {exp.endDate || 'Present'}</Text>
              <View style={styles.list}>
                {exp.description?.split('\n').map((line: string, j: number) => (
                  <Text key={j} style={styles.listItem}>• {line}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {education?.map((edu: any, i: number) => (
            <View key={i} style={styles.item}>
              <Text style={styles.itemTitle}>{edu.degree}</Text>
              <Text style={styles.itemSub}>{edu.school}</Text>
              <Text style={styles.itemDate}>{edu.startDate} - {edu.endDate}</Text>
            </View>
          ))}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text>{skills?.join(', ')}</Text>
        </View>
      </Page>
    </Document>
  );
};
