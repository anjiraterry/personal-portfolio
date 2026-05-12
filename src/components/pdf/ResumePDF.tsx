"use client";

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { PERSONAL, EXPERIENCE, EDUCATION, TECH_STACK } from '@/data/portfolio';

// Register fonts for better look
Font.register({
  family: 'Helvetica-Bold',
  src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica-bold@1.0.4/Helvetica-Bold.ttf'
});

const styles = StyleSheet.create({
  page: {
    padding: 30, // Reduced from 40
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 9, // Reduced from 10
    color: '#333333',
  },
  header: {
    marginBottom: 12, // Reduced from 20
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 8,
  },
  name: {
    fontSize: 20, // Reduced from 24
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  title: {
    fontSize: 10, // Reduced from 12
    color: '#00A79D',
    marginBottom: 4,
  },
  contactInfo: {
    flexDirection: 'row',
    gap: 12,
    color: '#666666',
    fontSize: 8,
  },
  section: {
    marginBottom: 10, // Reduced from 15
  },
  sectionTitle: {
    fontSize: 10, // Reduced from 12
    fontWeight: 'bold',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#00A79D',
    width: '100%',
    paddingBottom: 1,
  },
  experienceItem: {
    marginBottom: 6, // Reduced from 10
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  company: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  period: {
    color: '#666666',
    fontSize: 8,
  },
  role: {
    fontSize: 9,
    fontStyle: 'italic',
    marginBottom: 2,
    color: '#444444',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 1,
    paddingLeft: 8,
  },
  bullet: {
    width: 8,
  },
  bulletText: {
    flex: 1,
    color: '#555555',
    lineHeight: 1.3,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  skillBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 7,
    color: '#444444',
  }
});

export const ResumePDF = () => (
  <Document title={`${PERSONAL.name} Resume`}>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{PERSONAL.name}</Text>
        <Text style={styles.title}>{PERSONAL.title}</Text>
        <View style={styles.contactInfo}>
          <Text>{PERSONAL.email}</Text>
          <Text>{PERSONAL.location}</Text>
          <Text>github.com/anjiraterry</Text>
        </View>
      </View>

      {/* Profile Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Summary</Text>
        <Text style={{ lineHeight: 1.5 }}>{PERSONAL.bio}</Text>
      </View>

      {/* Experience */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        {EXPERIENCE.map((exp, i) => (
          <View key={i} style={styles.experienceItem}>
            <View style={styles.experienceHeader}>
              <Text style={styles.company}>{exp.company}</Text>
              <Text style={styles.period}>{exp.period}</Text>
            </View>
            <Text style={styles.role}>{exp.role}</Text>
            {exp.achievements.map((ach, j) => (
              <View key={j} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{ach}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technical Skills</Text>
        <View style={styles.skillsGrid}>
          {TECH_STACK.map((tech, i) => (
            <Text key={i} style={styles.skillBadge}>{tech.name}</Text>
          ))}
        </View>
      </View>

      {/* Education */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        {EDUCATION.map((edu, i) => (
          <View key={i} style={{ marginBottom: 5 }}>
            <View style={styles.experienceHeader}>
              <Text style={styles.company}>{edu.school}</Text>
              <Text style={styles.period}>{edu.year}</Text>
            </View>
            <Text>{edu.degree}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
