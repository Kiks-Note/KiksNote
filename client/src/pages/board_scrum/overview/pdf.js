import React, { useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

const PDFGenerator = ({ stories, releases }) => {
  const [formatedReleases, setFormatedReleases] = useState([]);

  useEffect(() => {
    const formatStories = () => {
      var formatedReleasesTemp = [];
      const formatedReleaseTemp = {};
      formatedReleaseTemp.sprints = [];

      Object.entries(releases).forEach((release) => {
        formatedReleaseTemp.name = release[0];
        release[1].forEach((sprint) => {
          let sprintData = {};
          sprintData.name = sprint.name;
          sprintData.stories = [];
          stories.forEach((story) => {
            if (story.boardId == sprint.boardId) {
              sprintData.stories = sprintData.stories.concat(story);
            }
          });
          formatedReleaseTemp.sprints = formatedReleaseTemp.sprints.concat(sprintData);
        });
        formatedReleasesTemp = formatedReleasesTemp.concat(formatedReleaseTemp);
      });
      setFormatedReleases(formatedReleasesTemp);
    };
    formatStories();
  }, [releases, stories]);

  const fakeReleases = [
    {
      id: 1,
      name: "Release 1",
      date: "2023-07-01",
      sprints: [
        {
          id: 4,
          name: "Sprint 1",
          stories: [
            { id: 4, name: "Story 1", status: "Done" },
            { id: 5, name: "Story 2", status: "In Progress" },
            { id: 6, name: "Story 3", status: "To Do" },
          ],
        },
        {
          id: 5,
          name: "Sprint 2",
          stories: [
            { id: 4, name: "Story 4", status: "Done" },
            { id: 5, name: "Story 5", status: "In Progress" },
            { id: 6, name: "Story 6", status: "To Do" },
          ],
        },
        {
          id: 6,
          name: "Sprint 3",
          stories: [
            { id: 4, name: "Story 7", status: "Done" },
            { id: 5, name: "Story 8", status: "In Progress" },
            { id: 6, name: "Story 9", status: "To Do" },
          ],
        },
        {
          id: 4,
          name: "Sprint 4",
          stories: [
            { id: 4, name: "Story 1", status: "Done" },
            { id: 5, name: "Story 2", status: "In Progress" },
            { id: 6, name: "Story 3", status: "To Do" },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Release 2",
      date: "2023-08-01",
      sprints: [
        {
          id: 4,
          name: "Sprint 1",
          stories: [
            { id: 4, name: "Story longue, ceci est la storie 1 qui est très longue", status: "Done" },
            { id: 5, name: "Story 2", status: "In Progress" },
            { id: 6, name: "Story 3", status: "To Do" },
          ],
        },
        {
          id: 5,
          name: "Sprint 2",
          stories: [
            { id: 4, name: "Story 4", status: "Done" },
            { id: 5, name: "Story 5", status: "In Progress" },
            { id: 6, name: "Story 6", status: "To Do" },
          ],
        },
        {
          id: 6,
          name: "Sprint 3",
          stories: [
            { id: 4, name: "Story 7", status: "Done" },
            { id: 5, name: "Story 8", status: "In Progress" },
            { id: 6, name: "Story 9", status: "To Do" },
          ],
        },
      ],
    },
  ];

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#E4E4E4",
      padding: 10,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    title: {
      fontSize: 24,
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: 10,
    },
    table: {
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCol: {
      flexDirection: "column",
    },
    tableCell: {
      width: "25%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      padding: 5,
      backgroundColor: "#bfd8ff",
    },
    tableCellLarge: {
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      padding: 5,
    },
    tableHeader: {
      borderRadius: "5",
      fontWeight: "bold",
      marginBottom: 10,
    },
    releaseHeader: {
      backgroundColor: "#8ab7ff",
    },
    sprintHeader: {
      backgroundColor: "#a2c4fc",
    },
  });
  const PDF = () => {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <View style={styles.tableHeader}>
              <Text style={styles.title}>Roadmap Boards Edu-Scrum</Text>
            </View>
            {formatedReleases.length > 0 &&
              formatedReleases.map((release) => (
                <View
                  style={{
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderColor: "#000",
                    marginBottom: 50,
                  }}
                >
                  <View>
                    <View style={[styles.tableCellLarge, styles.releaseHeader]}>
                      <Text>{release.name}</Text>
                    </View>
                    {release.sprints.map((sprint) => (
                      <View>
                        <View style={[styles.tableCellLarge, styles.sprintHeader]}>
                          <Text>{sprint.name}</Text>
                        </View>
                        <View style={styles.tableRow}>
                          <View style={[styles.tableCell, { width: "50%" }]}>
                            <Text>Nom de la story</Text>
                          </View>
                          <View style={[styles.tableCell, { width: "20%" }]}>
                            <Text>Valeur</Text>
                          </View>
                          <View style={[styles.tableCell, { width: "30%" }]}>
                            <Text>Avancement</Text>
                          </View>
                        </View>
                        {sprint.stories.map((story, index) => (
                          <View style={styles.tableRow}>
                            <View style={[styles.tableCell, { width: "50%" }]}>
                              <Text>{story.name}</Text>
                            </View>
                            <View style={[styles.tableCell, { width: "20%" }]}>
                              <Text>{story.value}</Text>
                            </View>
                            <View style={[styles.tableCell, { width: "30%" }]}>
                              <Text>10%</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                </View>
              ))}
          </View>
        </Page>
      </Document>
    );
  };

  const generatePDF = async () => {
    const blob = await pdf(<PDF />).toBlob();
    return blob;
  };

  const downloadPDF = async () => {
    const pdfBlob = await generatePDF();
    saveAs(pdfBlob, "roadmap.pdf");
  };

  return (
    <div>
      {formatedReleases.length > 0 ? (
        <button onClick={downloadPDF}>Download PDF</button>
      ) : (
        <button>PDF Not Ready Yet</button>
      )}
    </div>
  );
};

export default PDFGenerator;
